import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
// @ts-ignore
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AiContextService } from '../../application/services/ai-context.service';
import { EmailService } from './email.service';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

@Injectable()
export class AgentService {
    private agent: any;
    private memory: MemorySaver;
    private logger = new Logger(AgentService.name);

    constructor(
        private readonly aiContextService: AiContextService,
        private readonly emailService: EmailService
    ) {
        this.memory = new MemorySaver();
        this.initializeAgent();
    }

    private initializeAgent() {
        const llm = new ChatOpenAI({
            modelName: 'gpt-4o-mini',
            temperature: 0.2, // Keep it relatively grounded
        });

        const checkAvailabilityTool = tool(
            async ({ city, serviceType }) => {
                this.logger.log(`Tool called: check_availability for ${serviceType} in ${city}`);
                const vendorServices = await prisma.vendorService.findMany({
                    where: {
                        isAvailable: true,
                        branch: { city: { contains: city, mode: 'insensitive' } },
                        service: { name: serviceType as any }
                    },
                    include: { branch: true, service: true }
                });

                if (vendorServices.length === 0) return `No ${serviceType} available in ${city}.`;

                return vendorServices.map(vs =>
                    `- ${vs.branch.name} has ${serviceType} (Capacity: ${vs.maxCapacity}, Price: $${vs.pricePerUnit}/${vs.priceUnit})`
                ).join('\n');
            },
            {
                name: 'check_availability',
                description: 'Check availability of services (hot_desk, meeting_room, private_office) in a specific city.',
                schema: z.object({
                    city: z.string().describe('The city to check, e.g. Amman, Irbid, Aqaba'),
                    serviceType: z.enum(['hot_desk', 'meeting_room', 'private_office']).describe('The type of service requested')
                })
            }
        );

        const checkPricingTool = tool(
            async ({ serviceType, durationHours }) => {
                this.logger.log(`Tool called: check_pricing for ${serviceType} (${durationHours}h)`);
                // Mocking pricing rules logic for demonstration
                const baseRate = serviceType === 'meeting_room' ? 20 : 5;
                const discount = durationHours >= 8 ? 0.8 : 1;
                return `Estimated total for ${durationHours} hours of ${serviceType} is $${(baseRate * durationHours * discount).toFixed(2)}`;
            },
            {
                name: 'check_pricing',
                description: 'Calculates the estimated price for a booking duration.',
                schema: z.object({
                    serviceType: z.enum(['hot_desk', 'meeting_room', 'private_office']),
                    durationHours: z.number().describe('How many hours intended to book')
                })
            }
        );

        const branchFacilitiesTool = tool(
            async ({ branchName }) => {
                this.logger.log(`Tool called: branch_facilities for ${branchName}`);
                const branch = await prisma.branch.findFirst({
                    where: { name: { contains: branchName, mode: 'insensitive' } },
                    include: { branchFacilities: { include: { facility: true } } }
                });

                if (!branch) return `Branch ${branchName} not found.`;
                if (!branch.branchFacilities.length) return `No particular facilities listed for ${branchName}.`;

                return `Facilities at ${branch.name}: ` + branch.branchFacilities.map(f => f.facility.name).join(', ');
            },
            {
                name: 'branch_facilities',
                description: 'Query what amenities/facilities a specific branch has (e.g. WiFi, printer, coffee).',
                schema: z.object({
                    branchName: z.string().describe('The exact or partial name of the branch')
                })
            }
        );

        const bookRoomTool = tool(
            async ({ userEmail, city, serviceType, durationHours }) => {
                this.logger.log(`Tool called: book_room for ${userEmail} requesting ${serviceType} in ${city}`);

                // 1. Find an available service
                const vendorService = await prisma.vendorService.findFirst({
                    where: {
                        isAvailable: true,
                        branch: { city: { contains: city, mode: 'insensitive' } },
                        service: { name: serviceType as any }
                    },
                    include: { branch: true, service: true }
                });

                if (!vendorService) {
                    return `Sorry, no ${serviceType} is available to book in ${city}.`;
                }

                // 2. Mock finding or creating a customer
                let customer = await prisma.user.findFirst({ where: { email: userEmail, role: 'customer' } });
                if (!customer) {
                    customer = await prisma.user.create({
                        data: {
                            email: userEmail,
                            fullName: userEmail.split('@')[0],
                            role: 'customer',
                            status: 'active'
                        }
                    });
                }

                const totalCost = Number(vendorService.pricePerUnit) * durationHours;

                // 3. Create Booking
                const booking = await prisma.booking.create({
                    data: {
                        bookingNumber: `BOK-${Math.floor(Math.random() * 10000)}`,
                        customerId: customer.id,
                        vendorServiceId: vendorService.id,
                        bookingDate: new Date(),
                        quantity: 1,
                        totalPrice: totalCost,
                        status: 'confirmed'
                    }
                });

                // 4. Update Availability
                await prisma.vendorService.update({
                    where: { id: vendorService.id },
                    data: { isAvailable: false }
                });

                // 5. Fire off email
                const emailBody = `Hello ${customer.fullName},\n\nYour booking for a ${serviceType} at ${vendorService.branch.name} (${city}) is CONFIRMED!\n\nBooking Reference: ${booking.bookingNumber}\nTotal Cost: $${totalCost.toFixed(2)}\n\nThank you for choosing AtSpaces!`;
                await this.emailService.send(userEmail, 'Booking Confirmation - AtSpaces', emailBody);

                return `Booking successful! Reference number: ${booking.bookingNumber}. An email confirmation has been sent to ${userEmail}.`;
            },
            {
                name: 'book_room',
                description: 'Books a room/desk for a user and explicitly sends a confirmation email. ALWAYS ask for the user\'s email first if you do not have it.',
                schema: z.object({
                    userEmail: z.string().describe('The email address of the customer to send confirmation to.'),
                    city: z.string().describe('The city where they want to book'),
                    serviceType: z.enum(['hot_desk', 'meeting_room', 'private_office']).describe('The kind of space to book'),
                    durationHours: z.number().describe('How many hours they want to book for')
                })
            }
        );

        this.agent = createReactAgent({
            llm,
            tools: [checkAvailabilityTool, checkPricingTool, branchFacilitiesTool, bookRoomTool],
            checkpointSaver: this.memory,
        });

        this.logger.log("LangGraph React Agent Initialized.");
    }

    private verifyToken(token: string): any {
        try {
            const secret = process.env.JWT_SECRET || 'atspaces-super-secret-key-change-this-in-production';
            return jwt.verify(token, secret);
        } catch (error) {
            console.error('AgentService Token verification failed:', error);
            return null;
        }
    }

    /**
     * Exposes a streaming method that WebSockets will consume
     */
    async *streamChat(sessionId: string, humanMessage: string, token?: string) {
        let userId: number | null = null;

        if (token) {
            const payload = this.verifyToken(token);
            if (payload && (payload.sub || payload.id)) {
                userId = payload.sub || payload.id;
            }
        }

        // Save user message to DB if authenticated
        if (userId) {
            await prisma.aIChatMessage.create({
                data: {
                    userId,
                    role: 'user',
                    content: humanMessage
                }
            });
        }

        // Build the system prompt using AiContextService
        const systemPrompt = this.aiContextService.getSystemPrompt();
        const baseContext = await this.aiContextService.getBaseContextPayload();

        let fullSystemContext = `${systemPrompt}\n\n${baseContext}`;

        const messages: { role: string, content: string }[] = [];
        messages.push({ role: "system", content: fullSystemContext });

        // Load DB History if authenticated (limiting to last 15 messages for context window)
        if (userId) {
            const history = await prisma.aIChatMessage.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 15
            });
            // Reverse so they are chronological
            history.reverse().forEach(msg => {
                // Don't duplicate the current human message which was just inserted
                if (msg.role === 'user' && msg.content === humanMessage) return;
                messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
            });
        }

        messages.push({ role: "user", content: humanMessage });

        const inputs = { messages };

        const config = { configurable: { thread_id: sessionId } };

        // We use streamEvents to capture both the final LLM tokens and tool calls if needed
        const stream = await this.agent.streamEvents(inputs, { ...config, version: "v2" });

        let fullAssistantReply = "";

        for await (const event of stream) {
            // We only want to stream back the actual chat model generation chunks
            if (event.event === "on_chat_model_stream" && event.data.chunk.content) {
                fullAssistantReply += event.data.chunk.content;
                yield event.data.chunk.content;
            }
        }

        // Save assistant reply to DB if authenticated
        if (userId && fullAssistantReply) {
            await prisma.aIChatMessage.create({
                data: {
                    userId,
                    role: 'assistant',
                    content: fullAssistantReply
                }
            });
        }
    }
}

