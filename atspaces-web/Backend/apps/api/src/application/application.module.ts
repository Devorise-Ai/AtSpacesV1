import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { NotificationService } from './services/notification.service';
import { PricingService } from './services/pricing.service';
import { ApprovalRequestService } from './services/approval-request.service';
import { BookingService } from './services/booking.service';
import { BranchService } from './services/branch.service';
import { EmailService } from '../infrastructure/services/email.service';
import { SmsService } from '../infrastructure/services/sms.service';
import { AiContextService } from './services/ai-context.service';
import { AgentService } from '../infrastructure/services/agent.service';

import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { PrismaBookingRepository } from '../infrastructure/repositories/prisma-booking.repository';
import { PrismaVendorServiceRepository } from '../infrastructure/repositories/prisma-vendor-service.repository';
import { PrismaAvailabilityRepository } from '../infrastructure/repositories/prisma-availability.repository';
import { PrismaApprovalRequestRepository } from '../infrastructure/repositories/prisma-approval-request.repository';

@Module({
    imports: [InfrastructureModule],
    providers: [
        { provide: 'IPricingService', useClass: PricingService },
        { provide: 'INotificationService', useClass: NotificationService },
        { provide: 'IEmailService', useExisting: EmailService },
        { provide: 'ISmsService', useExisting: SmsService },
        { provide: 'IUserRepository', useExisting: PrismaUserRepository },
        { provide: 'IBookingRepository', useExisting: PrismaBookingRepository },
        { provide: 'IVendorServiceRepository', useExisting: PrismaVendorServiceRepository },
        { provide: 'IAvailabilityRepository', useExisting: PrismaAvailabilityRepository },
        { provide: 'IApprovalRequestRepository', useExisting: PrismaApprovalRequestRepository },
        NotificationService,
        PricingService,
        ApprovalRequestService,
        BookingService,
        BranchService,
        AiContextService,
        AgentService,
    ],
    exports: [
        NotificationService,
        PricingService,
        ApprovalRequestService,
        BookingService,
        BranchService,
        AiContextService,
        AgentService,
        'IPricingService',
        'INotificationService',
        'IEmailService',
        'ISmsService',
        'IUserRepository',
        'IBookingRepository',
        'IVendorServiceRepository',
        'IAvailabilityRepository',
        'IApprovalRequestRepository',
    ],
})
export class ApplicationModule { }
