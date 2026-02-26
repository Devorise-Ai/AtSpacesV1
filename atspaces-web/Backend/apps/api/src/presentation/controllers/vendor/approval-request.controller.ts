import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateApprovalRequestDto } from '../../../application/dtos/requests/create-approval-request.dto';
import { ApprovalRequestService } from '../../../application/services/approval-request.service';
// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../common/guards/roles.guard';
// import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Vendor Approvals')
@Controller('vendor/approval-requests')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class VendorApprovalController {
    constructor(private readonly approvalRequestService: ApprovalRequestService) { }

    @Post()
    // @Roles('vendor')
    async create(
        @Body() dto: CreateApprovalRequestDto,
        @Req() req: any,
    ) {
        const vendorId = req.user?.id || 1;
        return this.approvalRequestService.createRequest(Number(vendorId), dto);
    }
}
