import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from '../../application/guards/jwt-auth.guard';

const prisma = new PrismaClient();

@Controller('ai')
export class AiController {

    @Get('history')
    @UseGuards(JwtAuthGuard)
    async getChatHistory(@Request() req: any) {
        const userId = req.user.id;

        const history = await prisma.aIChatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true
            }
        });

        return history.map(msg => ({
            id: msg.id.toString(),
            role: msg.role,
            text: msg.content
        }));
    }
}
