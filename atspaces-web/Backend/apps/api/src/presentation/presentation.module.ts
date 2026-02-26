import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { VendorApprovalController } from './controllers/vendor/approval-request.controller';
import { AdminApprovalController } from './controllers/admin/approval-request.controller';
import { AuthController } from './controllers/auth.controller';
import { BranchController } from './controllers/branch.controller';
import { VendorController } from './controllers/vendor/vendor.controller';
import { AdminController } from './controllers/admin/admin.controller';
import { FacilitiesController } from './controllers/facilities.controller';
import { FeaturesController } from './controllers/features.controller';
import { ServicesController } from './controllers/services.controller';
import { ApplicationModule } from '../application/application.module';
import { ChatGateway } from './gateways/chat.gateway';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthModule } from '../application/auth.module';

@Module({
    imports: [ApplicationModule, InfrastructureModule, AuthModule],
    controllers: [
        // Auth
        AuthController,
        // Public Lookup
        BranchController,
        FacilitiesController,
        FeaturesController,
        ServicesController,
        // Customer (JWT)
        BookingsController,
        // Vendor (JWT)
        VendorApprovalController,
        VendorController,
        // Admin (JWT)
        AdminApprovalController,
        AdminController,
    ],
    providers: [ChatGateway],
})
export class PresentationModule { }
