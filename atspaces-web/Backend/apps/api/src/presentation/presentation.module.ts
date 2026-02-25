import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { VendorApprovalController } from './controllers/vendor/approval-request.controller';
import { AdminApprovalController } from './controllers/admin/approval-request.controller';
import { ApplicationModule } from '../application/application.module';
import { ChatGateway } from './gateways/chat.gateway';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
    imports: [ApplicationModule, InfrastructureModule],
    controllers: [
        BookingsController,
        VendorApprovalController,
        AdminApprovalController,
    ],
    providers: [ChatGateway]
})
export class PresentationModule { }
