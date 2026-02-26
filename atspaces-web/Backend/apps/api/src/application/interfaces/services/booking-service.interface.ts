import { Booking } from '../../../domain/entities/booking.entity';
import { CreateBookingDto } from '../../dtos/requests/create-booking.dto';

export interface IBookingService {
    createBooking(dto: CreateBookingDto, customerId: number): Promise<Booking>;
    checkIn(bookingId: number, vendorId: number): Promise<void>;
    cancelBooking(bookingId: number, userId: number, reason?: string): Promise<void>;
    markNoShow(bookingId: number, vendorId: number): Promise<void>;
    confirmPayment(bookingId: number): Promise<void>;
    findByCustomer(customerId: number): Promise<Booking[]>;
}
