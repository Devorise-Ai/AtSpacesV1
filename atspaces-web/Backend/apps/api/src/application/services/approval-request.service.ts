import { Injectable, Inject } from '@nestjs/common';
import type { IApprovalRequestRepository, EnrichedApprovalRequest } from '../../domain/interfaces/approval-request-repository.interface';
import type { IVendorServiceRepository } from '../../domain/interfaces/vendor-service-repository.interface';
import type { IAuditService } from '../interfaces/services/audit-service.interface';
import { ApprovalRequest } from '../../domain/entities/approval-request.entity';
import { CreateApprovalRequestDto } from '../dtos/requests/create-approval-request.dto';
import { BusinessException } from '../exceptions/business.exception';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';
import { RequestType } from '../../domain/enums/request-type.enum';

@Injectable()
export class ApprovalRequestService {
    constructor(
        @Inject('IApprovalRequestRepository') private readonly approvalRequestRepository: IApprovalRequestRepository,
        @Inject('IVendorServiceRepository') private readonly vendorServiceRepository: IVendorServiceRepository,
        // private readonly auditService: IAuditService, // Optional
    ) { }

    async createRequest(vendorId: number, dto: CreateApprovalRequestDto): Promise<ApprovalRequest> {
        const request = new ApprovalRequest(
            0, // Auto-increment handled by DB
            vendorId,
            dto.branchId,
            dto.serviceId,
            dto.requestType,
            dto.oldValue,
            dto.newValue,
            dto.reason
        );
        await this.approvalRequestRepository.save(request);
        return request;
    }

    async approveRequest(requestId: number, adminId: number, reviewNotes?: string): Promise<void> {
        const request = await this.approvalRequestRepository.findById(requestId);
        if (!request) {
            throw new BusinessException('Approval request not found');
        }

        request.approve(adminId, reviewNotes);
        await this.approvalRequestRepository.save(request);

        // If capacity change and serviceId, update vendorService capacity
        if (request.requestType === RequestType.CAPACITY_CHANGE && request.serviceId) {
            const vendorService = await this.vendorServiceRepository.findById(request.serviceId);
            if (vendorService) {
                // Update implementation here if needed
            }
        }
    }

    async rejectRequest(requestId: number, adminId: number, reviewNotes?: string): Promise<void> {
        const request = await this.approvalRequestRepository.findById(requestId);
        if (!request) {
            throw new BusinessException('Approval request not found');
        }

        request.reject(adminId, reviewNotes);
        await this.approvalRequestRepository.save(request);
    }

    async getPendingRequests(): Promise<EnrichedApprovalRequest[]> {
        return this.approvalRequestRepository.findByStatus(ApprovalStatus.PENDING);
    }
}
