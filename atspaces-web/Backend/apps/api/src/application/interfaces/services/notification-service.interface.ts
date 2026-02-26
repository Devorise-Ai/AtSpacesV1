import { Booking } from '../../../domain/entities/booking.entity';
import { ApprovalRequest } from '../../../domain/entities/approval-request.entity';

export interface INotificationService {
    sendBookingConfirmation(booking: Booking, customerId: number): Promise<void>;
    sendBookingCancelled(booking: Booking, customerId: number): Promise<void>;
    sendReviewRequest(booking: Booking, customerId: number): Promise<void>;
    sendApprovalNotification(request: ApprovalRequest, vendorId: number): Promise<void>;
    sendSmsVerification(phoneNumber: string, code: string): Promise<void>;
}
