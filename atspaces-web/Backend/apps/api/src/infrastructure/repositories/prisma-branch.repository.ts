import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface BranchWithDetails {
    id: number;
    name: string;
    description: string | null;
    city: string;
    address: string;
    status: string;
    createdAt: Date;
    vendorId: number;
    vendorServices: {
        id: number;
        maxCapacity: number;
        pricePerUnit: any;
        priceUnit: string;
        isAvailable: boolean;
        service: { id: number; name: string; description: string | null };
        serviceFeatures: { quantity: number; feature: { id: number; name: string; icon: string | null } }[];
    }[];
    branchFacilities: {
        isAvailable: boolean;
        facility: { id: number; name: string; icon: string | null };
    }[];
}

@Injectable()
export class PrismaBranchRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(city?: string): Promise<BranchWithDetails[]> {
        return this.prisma.branch.findMany({
            where: {
                status: 'active',
                ...(city ? { city } : {}),
            },
            include: {
                vendorServices: {
                    where: { isAvailable: true },
                    include: {
                        service: true,
                        serviceFeatures: { include: { feature: true } },
                    },
                },
                branchFacilities: {
                    where: { isAvailable: true },
                    include: { facility: true },
                },
            },
        }) as any;
    }

    async findById(id: number): Promise<BranchWithDetails | null> {
        return this.prisma.branch.findUnique({
            where: { id },
            include: {
                vendorServices: {
                    where: { isAvailable: true },
                    include: {
                        service: true,
                        serviceFeatures: { include: { feature: true } },
                    },
                },
                branchFacilities: {
                    where: { isAvailable: true },
                    include: { facility: true },
                },
            },
        }) as any;
    }

    async findByVendor(vendorId: number): Promise<BranchWithDetails[]> {
        return this.prisma.branch.findMany({
            where: { vendorId },
            include: {
                vendorServices: {
                    include: {
                        service: true,
                        serviceFeatures: { include: { feature: true } },
                    },
                },
                branchFacilities: {
                    include: { facility: true },
                },
            },
        }) as any;
    }

    async create(data: {
        vendorId: number;
        name: string;
        description?: string;
        city: string;
        address: string;
        latitude?: number;
        longitude?: number;
    }) {
        return this.prisma.branch.create({ data: data as any });
    }

    async update(id: number, data: Partial<{ name: string; description: string; city: string; address: string; status: string }>) {
        return this.prisma.branch.update({ where: { id }, data: data as any });
    }

    async countByVendor(vendorId: number) {
        return this.prisma.branch.count({ where: { vendorId } });
    }

    async countByStatus(vendorId: number, status: string) {
        return this.prisma.branch.count({ where: { vendorId, status: status as any } });
    }
}
