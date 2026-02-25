import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { NotificationService } from './services/notification.service';
import { PricingService } from './services/pricing.service';
import { ApprovalRequestService } from './services/approval-request.service';
import { BookingService } from './services/booking.service';
import { EmailService } from '../infrastructure/services/email.service';
import { SmsService } from '../infrastructure/services/sms.service';
import { AiContextService } from './services/ai-context.service';
import { AgentService } from '../infrastructure/services/agent.service';

// Mock repositories for providers since they are interfaces and don't have implementations yet
// This is just to satisfy DI in NestJS, in reality you'd provide implementations
const MockVendorServiceRepository = { provide: 'IVendorServiceRepository', useValue: {} };
const MockApprovalRequestRepository = { provide: 'IApprovalRequestRepository', useValue: {} };
const MockBookingRepository = { provide: 'IBookingRepository', useValue: {} };
const MockAvailabilityRepository = { provide: 'IAvailabilityRepository', useValue: {} };
const MockUserRepository = { provide: 'IUserRepository', useValue: {} };

@Module({
    imports: [InfrastructureModule],
    providers: [
        { provide: 'IPricingService', useClass: PricingService },
        { provide: 'INotificationService', useClass: NotificationService },
        { provide: 'IEmailService', useExisting: EmailService },
        { provide: 'ISmsService', useExisting: SmsService },
        NotificationService,
        PricingService,
        ApprovalRequestService,
        BookingService,
        AiContextService,
        AgentService,
        MockVendorServiceRepository,
        MockApprovalRequestRepository,
        MockBookingRepository,
        MockAvailabilityRepository,
        MockUserRepository,
    ],
    exports: [NotificationService, PricingService, ApprovalRequestService, BookingService, AiContextService, AgentService],
})
export class ApplicationModule { }
