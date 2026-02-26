import { Body, Controller, Get, Param, Post, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovalRequestService } from '../../../application/services/approval-request.service';

@ApiTags('Admin Approvals')
@Controller('admin/approval-requests')
export class AdminApprovalController {
    constructor(private readonly approvalRequestService: ApprovalRequestService) { }

    @Get()
    async listPending() {
        return this.approvalRequestService.getPendingRequests();
    }

    @Post(':id/approve')
    async approve(
        @Param('id', ParseIntPipe) id: number,
        @Body('notes') notes: string,
        @Req() req: any,
    ) {
        const adminId = req.user?.id || 1;
        return this.approvalRequestService.approveRequest(id, Number(adminId), notes);
    }

    @Post(':id/reject')
    async reject(
        @Param('id', ParseIntPipe) id: number,
        @Body('notes') notes: string,
        @Req() req: any,
    ) {
        const adminId = req.user?.id || 1;
        return this.approvalRequestService.rejectRequest(id, Number(adminId), notes);
    }
}
