import { Booking } from '../entities/booking.entity';

export interface IBookingRepository {
    findById(id: number): Promise<Booking | null>;
    findByCustomer(customerId: number): Promise<Booking[]>;
    save(booking: Booking): Promise<void>;
}
