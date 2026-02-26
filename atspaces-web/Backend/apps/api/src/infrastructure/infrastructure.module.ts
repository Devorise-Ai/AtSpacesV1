import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaBookingRepository } from './repositories/prisma-booking.repository';
import { PrismaVendorServiceRepository } from './repositories/prisma-vendor-service.repository';
import { PrismaAvailabilityRepository } from './repositories/prisma-availability.repository';
import { PrismaApprovalRequestRepository } from './repositories/prisma-approval-request.repository';
import { PrismaBranchRepository } from './repositories/prisma-branch.repository';

@Module({
    imports: [PrismaModule],
    providers: [
        EmailService,
        SmsService,
        PrismaUserRepository,
        PrismaBookingRepository,
        PrismaVendorServiceRepository,
        PrismaAvailabilityRepository,
        PrismaApprovalRequestRepository,
        PrismaBranchRepository,
    ],
    exports: [
        EmailService,
        SmsService,
        PrismaModule,
        PrismaUserRepository,
        PrismaBookingRepository,
        PrismaVendorServiceRepository,
        PrismaAvailabilityRepository,
        PrismaApprovalRequestRepository,
        PrismaBranchRepository,
    ],
})
export class InfrastructureModule { }
