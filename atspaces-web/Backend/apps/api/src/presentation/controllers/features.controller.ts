import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@ApiTags('Lookup')
@Controller('features')
export class FeaturesController {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * GET /features
     * Public: List all available service features (whiteboard, projector, etc.)
     */
    @Get()
    async findAll() {
        return this.prisma.feature.findMany({
            orderBy: { name: 'asc' },
        });
    }
}
