import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@ApiTags('Lookup')
@Controller('services')
export class ServicesController {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * GET /services
     * Public: List all service types (hot_desk, private_office, meeting_room)
     */
    @Get()
    async findAll() {
        return this.prisma.service.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
