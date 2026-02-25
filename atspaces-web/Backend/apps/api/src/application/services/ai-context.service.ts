import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AiContextService {

    /**
     * [AID-1] 
     * The master system prompt combining the persona, rules, and context logic.
     */
    getSystemPrompt(): string {
        return `You are "At Spaces Assistant", a highly helpful, intelligent AI designed to help customers find and book coworking spaces in Jordan.
        
You must follow these core guidelines strictly:
1. **Coworking Terminology:** Always refer to spaces strictly as "hot_desk" (open seating), "private_office" (enclosed team space), or "meeting_room" (bookable by the hour).
2. **Jordanian Cities Focus:** The primary cities we operate in are Amman, Irbid, and Aqaba.
3. **Tone:** Be professional, friendly, and concise. Do not use overly formal language. Be conversational.
4. **Accuracy:** If the user asks for branch availability, pricing, or facilities, DO NOT guess. Use your available tools to query the live database. Once you get the result from the tool, summarize it nicely for the user.
5. **Booking:** You cannot make bookings directly yet, but you can guide the user to the web app interface to finalize a booking after you find a suitable space.

Start out by introducing yourself if it's the beginning of the conversation. Otherwise, answer the user's inquiry based on the tool data provided.
`;
    }

    /**
     * [AID-2]
     * A helper method to fetch real-time baseline context about our branches 
     * before the agent needs to explicitly call a tool. This gives the agent 
     * an awareness of the general active branches.
     */
    async getBaseContextPayload(): Promise<string> {
        try {
            const branches = await prisma.branch.findMany({
                where: { status: 'active' },
                select: {
                    name: true,
                    city: true,
                    address: true,
                    description: true,
                }
            });

            return `--- BASE KNOWLEDGE ---
Currently Active Branches:
${JSON.stringify(branches, null, 2)}
----------------------`;
        } catch (error) {
            console.error('Error fetching base context:', error);
            return '--- BASE KNOWLEDGE ---\nError retrieving branch data currently.\n----------------------';
        }
    }
}
