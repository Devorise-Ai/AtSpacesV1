import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Booking } from '../../domain/entities/booking.entity';
import { IBookingRepository } from '../../domain/interfaces/booking-repository.interface';
import { BookingStatus } from '../../domain/enums/booking-status.enum';

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapPrismaToEntity(prismaBooking: any): Booking {
        return new Booking(
            prismaBooking.id,
            prismaBooking.bookingNumber,
            prismaBooking.customerId,
            prismaBooking.vendorServiceId,
            prismaBooking.startTime,
            prismaBooking.endTime,
            prismaBooking.quantity,
            Number(prismaBooking.totalPrice),
            prismaBooking.status as BookingStatus,
            prismaBooking.createdAt,
        );
    }

    async findById(id: number): Promise<Booking | null> {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        return booking ? this.mapPrismaToEntity(booking) : null;
    }

    async findByCustomer(customerId: number): Promise<Booking[]> {
        const bookings = await this.prisma.booking.findMany({ where: { customerId } });
        return bookings.map(b => this.mapPrismaToEntity(b));
    }

    async findByVendor(vendorId: number): Promise<Booking[]> {
        const bookings = await this.prisma.booking.findMany({
            where: {
                vendorService: {
                    branch: {
                        vendorId: vendorId
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });
        return bookings.map(b => this.mapPrismaToEntity(b));
    }

    async save(booking: Booking): Promise<void> {
        await this.prisma.booking.upsert({
            where: { id: booking.id || 0 }, // If id is 0 or undefined, it's a new booking
            update: {
                status: booking.status as any,
                totalPrice: booking.totalPrice,
                quantity: booking.quantity,
                startTime: booking.startTime,
                endTime: booking.endTime,
            },
            create: {
                bookingNumber: booking.bookingNumber,
                customerId: booking.customerId,
                vendorServiceId: booking.vendorServiceId,
                bookingDate: booking.startTime, // Assuming bookingDate is start date
                startTime: booking.startTime,
                endTime: booking.endTime,
                quantity: booking.quantity,
                totalPrice: booking.totalPrice,
                status: booking.status as any,
            },
        });
    }
}
