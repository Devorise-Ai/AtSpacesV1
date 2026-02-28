import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../application/guards/jwt-auth.guard';
import { BranchService } from '../../../application/services/branch.service';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

class CreateBranchDto {
    name: string;
    description?: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
}

class UpdateBranchDto {
    name?: string;
    description?: string;
    city?: string;
    address?: string;
}

@ApiTags('Vendor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendor')
export class VendorController {
    constructor(
        private readonly branchService: BranchService,
        private readonly prisma: PrismaService,
    ) { }

    /**
     * GET /vendor/dashboard
     * Returns stats: total branches, active/pending, total services
     */
    @Get('dashboard')
    async getDashboard(@Req() req: any) {
        const vendorId = req.user?.id;
        return this.branchService.getVendorStats(vendorId);
    }

    /**
     * GET /vendor/branches
     * List all branches belonging to the authenticated vendor
     */
    @Get('branches')
    async getMyBranches(@Req() req: any) {
        const vendorId = req.user?.id;
        return this.branchService.getVendorBranches(vendorId);
    }

    /**
     * GET /vendor/branches/:id
     * Get details of a specific branch (vendor must own it)
     */
    @Get('branches/:id')
    async getBranch(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const branch = await this.branchService.getBranchDetails(id);
        if (!branch) throw new NotFoundException(`Branch ${id} not found`);
        if (branch.vendorId !== req.user?.id) throw new NotFoundException(`Branch ${id} not found`);
        return branch;
    }

    /**
     * POST /vendor/branches
     * Create a new branch for the authenticated vendor
     */
    @Post('branches')
    async createBranch(@Body() dto: CreateBranchDto, @Req() req: any) {
        const vendorId = req.user?.id;
        return this.branchService.createBranch(vendorId, dto);
    }

    /**
     * PATCH /vendor/branches/:id
     * Update a branch's info
     */
    @Patch('branches/:id')
    async updateBranch(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBranchDto,
        @Req() req: any,
    ) {
        const branch = await this.branchService.getBranchDetails(id);
        if (!branch || branch.vendorId !== req.user?.id) {
            throw new NotFoundException(`Branch ${id} not found`);
        }
        return this.branchService.updateBranch(id, dto);
    }

    /**
     * GET /vendor/availability/:serviceId
     * Fetch availability records for a vendor service
     */
    @Get('availability/:serviceId')
    async getAvailability(@Param('serviceId', ParseIntPipe) serviceId: number, @Req() req: any) {
        // Verification: service must belong to vendor
        const vs = await this.prisma.vendorService.findUnique({
            where: { id: serviceId },
            include: { branch: true }
        });
        if (!vs || vs.branch.vendorId !== req.user?.id) {
            throw new NotFoundException(`Resource ${serviceId} not found`);
        }

        return this.prisma.availability.findMany({
            where: { vendorServiceId: serviceId },
            orderBy: { date: 'asc' }
        });
    }

    /**
     * POST /vendor/availability/toggle-block
     * Toggle block/unblock for a specific availability record
     */
    @Post('availability/toggle-block')
    async toggleBlock(@Body() dto: { availabilityId: number }, @Req() req: any) {
        const avail = await this.prisma.availability.findUnique({
            where: { id: dto.availabilityId },
            include: { vendorService: { include: { branch: true } } }
        });

        if (!avail || avail.vendorService.branch.vendorId !== req.user?.id) {
            throw new NotFoundException(`Availability record ${dto.availabilityId} not found`);
        }

        return this.prisma.availability.update({
            where: { id: dto.availabilityId },
            data: { isBlocked: !avail.isBlocked }
        });
    }

    /**
     * PATCH /vendor/services/:id
     * Update vendor service details (pricing, capacity, etc)
     */
    @Patch('services/:id')
    async updateService(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: {
            maxCapacity?: number;
            pricePerUnit?: number;
            priceUnit?: string;
            isAvailable?: boolean;
            minBookingDuration?: number;
            maxBookingDuration?: number;
            cancellationPolicy?: string;
        },
        @Req() req: any
    ) {
        const vs = await this.prisma.vendorService.findUnique({
            where: { id },
            include: { branch: true }
        });

        if (!vs || vs.branch.vendorId !== req.user?.id) {
            throw new NotFoundException(`Resource ${id} not found`);
        }

        return this.prisma.vendorService.update({
            where: { id },
            data: {
                ...dto,
                pricePerUnit: dto.pricePerUnit ? (dto.pricePerUnit as any) : undefined
            }
        });
    }
}
