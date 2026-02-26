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

        return {
            totalBranches,
            activeBranches,
            pendingBranches,
            totalServices,
        };
    }
}
