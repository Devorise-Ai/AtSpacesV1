import { Injectable } from '@nestjs/common';
import { PrismaBranchRepository } from '../../infrastructure/repositories/prisma-branch.repository';
import { PrismaBookingRepository } from '../../infrastructure/repositories/prisma-booking.repository';

@Injectable()
export class BranchService {
    constructor(
        private readonly branchRepository: PrismaBranchRepository,
        private readonly bookingRepository: PrismaBookingRepository,
    ) { }

    async listBranches(city?: string) {
        return this.branchRepository.findAll(city);
    }

    async getBranchDetails(id: number) {
        const branch = await this.branchRepository.findById(id);
        if (!branch) {
            throw new Error(`Branch with id ${id} not found`);
        }
        return branch;
    }

    async getVendorBranches(vendorId: number) {
        return this.branchRepository.findByVendor(vendorId);
    }

    async createBranch(vendorId: number, data: {
        name: string;
        description?: string;
        city: string;
        address: string;
        latitude?: number;
        longitude?: number;
    }) {
        return this.branchRepository.create({ vendorId, ...data });
    }

    async updateBranch(id: number, data: Partial<{ name: string; description: string; city: string; address: string }>) {
        return this.branchRepository.update(id, data);
    }

    async getVendorStats(vendorId: number) {
        const [totalBranches, activeBranches, pendingBranches] = await Promise.all([
            this.branchRepository.countByVendor(vendorId),
            this.branchRepository.countByStatus(vendorId, 'active'),
            this.branchRepository.countByStatus(vendorId, 'pending'),
        ]);

        const branches = await this.branchRepository.findByVendor(vendorId);
        const totalServices = branches.reduce((acc, b) => acc + b.vendorServices.length, 0);

        // Calculate occupancy/revenue (Mock/Basic logic for now based on bookings)
        const branchIds = branches.map(b => b.id);
        const vendorBookings = await this.bookingRepository.findByVendor(vendorId);

        // Revenue logic (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentBookings = vendorBookings.filter(b => b.createdAt >= thirtyDaysAgo);
        const totalRevenue = recentBookings.reduce((acc, b) => acc + Number(b.totalPrice), 0);

        // Daily revenue for chart
        const dailyRevenue: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyRevenue[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
        }

        recentBookings.forEach(b => {
            const day = b.createdAt.toLocaleDateString('en-US', { weekday: 'short' });
            if (dailyRevenue[day] !== undefined) {
                dailyRevenue[day] += Number(b.totalPrice);
            }
        });

        const revenueData = Object.entries(dailyRevenue).map(([name, value]) => ({ name, value })).reverse();

        // Service distribution
        const serviceMap: Record<string, number> = {};
        vendorBookings.forEach(b => {
            const name = b.vendorService?.service?.name || "Other";
            serviceMap[name] = (serviceMap[name] || 0) + 1;
        });
        const serviceDistribution = Object.entries(serviceMap).map(([name, value]) => ({ name, value }));

        return {
            totalBranches,
            activeBranches,
            pendingBranches,
            totalServices,
            totalRevenue,
            revenueData,
            serviceDistribution,
            occupancyPct: Math.min(100, (vendorBookings.filter(b => b.status === 'confirmed').length * 20)) // Mock occupancy
        };
    }
}
