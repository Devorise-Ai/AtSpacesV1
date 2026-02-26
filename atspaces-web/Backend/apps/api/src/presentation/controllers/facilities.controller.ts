import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@ApiTags('Lookup')
@Controller('facilities')
export class FacilitiesController {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * GET /facilities
     * Public: List all available facility types (wifi, parking, etc.)
     */
    @Get()
    async findAll() {
        return this.prisma.facility.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
