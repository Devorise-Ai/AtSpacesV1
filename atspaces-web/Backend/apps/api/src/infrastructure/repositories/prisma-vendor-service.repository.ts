import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VendorService } from '../../domain/entities/vendor-service.entity';
import { IVendorServiceRepository } from '../../domain/interfaces/vendor-service-repository.interface';

@Injectable()
export class PrismaVendorServiceRepository implements IVendorServiceRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapPrismaToEntity(prismaVS: any): VendorService {
        return new VendorService({
            id: prismaVS.id,
            branchId: prismaVS.branchId,
            serviceId: prismaVS.serviceId,
            isAvailable: prismaVS.isAvailable,
            maxCapacity: prismaVS.maxCapacity,
            pricePerUnit: Number(prismaVS.pricePerUnit),
            priceUnit: prismaVS.priceUnit,
            minBookingDuration: prismaVS.minBookingDuration,
            maxBookingDuration: prismaVS.maxBookingDuration,
            cancellationPolicy: prismaVS.cancellationPolicy,
            createdAt: prismaVS.createdAt,
            updatedAt: prismaVS.updatedAt,
        });
    }

    async findById(id: number): Promise<VendorService | null> {
        const vs = await this.prisma.vendorService.findUnique({ where: { id } });
        return vs ? this.mapPrismaToEntity(vs) : null;
    }

    async findByBranchId(branchId: number): Promise<VendorService[]> {
        const vss = await this.prisma.vendorService.findMany({ where: { branchId } });
        return vss.map(vs => this.mapPrismaToEntity(vs));
    }

    async save(vendorService: Partial<VendorService>): Promise<VendorService> {
        const saved = await this.prisma.vendorService.create({
            data: {
                branchId: vendorService.branchId!,
                serviceId: vendorService.serviceId!,
                maxCapacity: vendorService.maxCapacity!,
                pricePerUnit: vendorService.pricePerUnit!,
                priceUnit: vendorService.priceUnit as any,
                isAvailable: vendorService.isAvailable ?? true,
                minBookingDuration: vendorService.minBookingDuration || 1,
                maxBookingDuration: vendorService.maxBookingDuration,
                cancellationPolicy: vendorService.cancellationPolicy,
            },
        });
        return this.mapPrismaToEntity(saved);
    }

    async update(id: number, vendorService: Partial<VendorService>): Promise<VendorService> {
        const updated = await this.prisma.vendorService.update({
            where: { id },
            data: {
                isAvailable: vendorService.isAvailable,
                maxCapacity: vendorService.maxCapacity,
                pricePerUnit: vendorService.pricePerUnit,
                priceUnit: vendorService.priceUnit as any,
                minBookingDuration: vendorService.minBookingDuration,
                maxBookingDuration: vendorService.maxBookingDuration,
                cancellationPolicy: vendorService.cancellationPolicy,
            },
        });
        return this.mapPrismaToEntity(updated);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.vendorService.delete({ where: { id } });
    }
}
