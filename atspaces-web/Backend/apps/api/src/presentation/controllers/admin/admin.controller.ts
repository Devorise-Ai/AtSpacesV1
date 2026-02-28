import { Controller, Get, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../application/guards/jwt-auth.guard';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { ApprovalRequestService } from '../../../application/services/approval-request.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly approvalService: ApprovalRequestService,
    ) { }

    /**
     * GET /admin/dashboard
     * Platform-wide stats: users, branches, bookings, pending approvals
     */
    @Get('dashboard')
    async getDashboard() {
        const [totalUsers, totalBranches, totalBookings, pendingApprovals, activeBranches] =
            await Promise.all([
                this.prisma.user.count(),
                this.prisma.branch.count(),
                this.prisma.booking.count(),
                this.prisma.approvalRequest.count({ where: { status: 'pending' } }),
                this.prisma.branch.count({ where: { status: 'active' } }),
            ]);

        const [customerCount, vendorCount] = await Promise.all([
            this.prisma.user.count({ where: { role: 'customer' } }),
            this.prisma.user.count({ where: { role: 'vendor' } }),
        ]);

        return {
            users: { total: totalUsers, customers: customerCount, vendors: vendorCount },
            branches: { total: totalBranches, active: activeBranches },
            bookings: { total: totalBookings },
            pendingApprovals,
        };
    }

    /**
     * GET /admin/users
     * List all users with their role and status
     */
    @Get('users')
    async listUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * GET /admin/approval-requests
     * List all pending approval requests
     */
    @Get('approval-requests')
    async listApprovalRequests() {
        return this.prisma.approvalRequest.findMany({
            include: {
                vendor: { select: { id: true, fullName: true, email: true } },
                branch: { select: { id: true, name: true, city: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * PATCH /admin/approval-requests/:id/approve
     * Approve an approval request
     */
    @Patch('approval-requests/:id/approve')
    async approveRequest(@Param('id', ParseIntPipe) id: number) {
        return this.approvalService.approveRequest(id, 0);
    }

    /**
     * PATCH /admin/approval-requests/:id/reject
     * Reject an approval request with a reason
     */
    @Patch('approval-requests/:id/reject')
    async rejectRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body('reason') reason: string,
    ) {
        return this.approvalService.rejectRequest(id, 0, reason);
    }

    /**
     * PATCH /admin/users/:id/suspend
     * Suspend a user account
     */
    @Patch('users/:id/suspend')
    async suspendUser(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.user.update({
            where: { id },
            data: { status: 'suspended' },
            select: { id: true, fullName: true, email: true, status: true },
        });
    }

    /**
     * PATCH /admin/users/:id/activate
     * Reactivate a suspended user account
     */
    @Patch('users/:id/activate')
    async activateUser(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.user.update({
            where: { id },
            data: { status: 'active' },
            select: { id: true, fullName: true, email: true, status: true },
        });
    }

    /**
     * PATCH /admin/branches/:id/pause
     * Suspend a branch (prevents new bookings)
     */
    @Patch('branches/:id/pause')
    async pauseBranch(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.branch.update({
            where: { id },
            data: { status: 'suspended' },
            select: { id: true, name: true, city: true, status: true },
        });
    }

    /**
     * PATCH /admin/branches/:id/resume
     * Resume a suspended branch
     */
    @Patch('branches/:id/resume')
    async resumeBranch(@Param('id', ParseIntPipe) id: number) {
        return this.prisma.branch.update({
            where: { id },
            data: { status: 'active' },
            select: { id: true, name: true, city: true, status: true },
        });
    }

    /**
     * PATCH /admin/branches/:id/amenities
     * Update branch facilities
     */
    @Patch('branches/:id/amenities')
    async updateBranchAmenities(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { facilities?: string[] },
    ) {
        if (body.facilities) {
            await this.prisma.branchFacility.deleteMany({ where: { branchId: id } });
            for (const facilityId of body.facilities) {
                await this.prisma.branchFacility.create({
                    data: { branchId: id, facilityId: parseInt(facilityId) },
                });
            }
        }
        return this.prisma.branch.findUnique({
            where: { id },
            include: {
                branchFacilities: { include: { facility: true } },
            },
        });
    }

    /**
     * PATCH /admin/pricing/:serviceId
     * Update platform-wide pricing for a service type
     */
    @Patch('pricing/:serviceId')
    async updatePricing(
        @Param('serviceId', ParseIntPipe) serviceId: number,
        @Body() body: { pricePerUnit?: number; priceUnit?: string },
    ) {
        const data: any = {};
        if (body.pricePerUnit !== undefined) data.pricePerUnit = body.pricePerUnit;
        if (body.priceUnit) data.priceUnit = body.priceUnit;
        const updated = await this.prisma.vendorService.updateMany({
            where: { serviceId },
            data,
        });
        return { updated: updated.count, serviceId };
    }
}

