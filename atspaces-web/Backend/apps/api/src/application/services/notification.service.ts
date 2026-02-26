import { Injectable, Logger, Inject } from '@nestjs/common';
import type { INotificationService } from '../interfaces/services/notification-service.interface';
import type { IEmailService } from '../interfaces/external/email-service.interface';
import type { ISmsService } from '../interfaces/external/sms-service.interface';
import type { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { Booking } from '../../domain/entities/booking.entity';
import { ApprovalRequest } from '../../domain/entities/approval-request.entity';

@Injectable()
export class NotificationService implements INotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        @Inject('IEmailService') private readonly emailService: IEmailService,
        @Inject('ISmsService') private readonly smsService: ISmsService,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) { }

    async sendBookingConfirmation(booking: Booking, customerId: number): Promise<void> {
        try {
            const user = await this.userRepository.findById(customerId);
            if (!user) return;

            const message = `Your booking ${booking.bookingNumber} is confirmed!`;
            if (user.email) await this.emailService.send(user.email, 'Booking Confirmed', message);
            if (user.phoneNumber) await this.smsService.send(user.phoneNumber, message);
        } catch (error) {
            this.logger.error(`Failed to send booking confirmation for ${booking.id}`, error);
        }
    }

    async sendBookingCancelled(booking: Booking, customerId: number): Promise<void> {
        try {
            const user = await this.userRepository.findById(customerId);
            if (!user) return;

            const message = `Your booking ${booking.bookingNumber} has been cancelled.`;
            if (user.email) await this.emailService.send(user.email, 'Booking Cancelled', message);
            if (user.phoneNumber) await this.smsService.send(user.phoneNumber, message);
        } catch (error) {
            this.logger.error(`Failed to send booking cancellation for ${booking.id}`, error);
        }
    }

    async sendReviewRequest(booking: Booking, customerId: number): Promise<void> {
        try {
            const user = await this.userRepository.findById(customerId);
            if (!user) return;

            const message = `Hope you enjoyed your experience with booking ${booking.bookingNumber}! Please leave a review.`;
            if (user.email) await this.emailService.send(user.email, 'Leave a Review', message);
            if (user.phoneNumber) await this.smsService.send(user.phoneNumber, message);
        } catch (error) {
            this.logger.error(`Failed to send review request for ${booking.id}`, error);
        }
    }

    async sendApprovalNotification(request: ApprovalRequest, vendorId: number): Promise<void> {
        try {
            const vendor = await this.userRepository.findById(vendorId);
            if (!vendor) return;

            const status = request.status;
            const message = `Your request (ID: ${request.id}) is now ${status}. ${request.reviewNotes ? 'Notes: ' + request.reviewNotes : ''}`;

            if (vendor.email) await this.emailService.send(vendor.email, `Request Update`, message);
            if (vendor.phoneNumber) await this.smsService.send(vendor.phoneNumber, message);
        } catch (error) {
            this.logger.error(`Failed to send approval notification to vendor ${vendorId}`, error);
        }
    }

    async sendSmsVerification(phoneNumber: string, code: string): Promise<void> {
        try {
            const message = `Your verification code is: ${code}`;
            await this.smsService.send(phoneNumber, message);
        } catch (error) {
            this.logger.error(`Failed to send SMS verification to ${phoneNumber}`, error);
        }
    }
}
