import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';

@Injectable()
export class PrismaAvailabilityRepository implements IAvailabilityRepository {
    constructor(private readonly prisma: PrismaService) { }

    async checkAvailability(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<boolean> {
        // Basic implementation: check if sum of booked units in any slot during this time exceeds max capacity
        // For now, we'll check the 'availability' table directly
        const availability = await this.prisma.availability.findFirst({
            where: {
                vendorServiceId,
                date: start, // Assuming for now it's a single day check
                availableUnits: { gte: quantity },
                isBlocked: false,
            },
        });

        return !!availability;
    }

    async decreaseUnits(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<void> {
        await this.prisma.availability.updateMany({
            where: {
                vendorServiceId,
                date: start,
            },
            data: {
                availableUnits: { decrement: quantity },
            },
        });
    }

    async increaseUnits(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<void> {
        await this.prisma.availability.updateMany({
            where: {
                vendorServiceId,
                date: start,
            },
            data: {
                availableUnits: { increment: quantity },
            },
        });
    }
}
