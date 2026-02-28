import { ApprovalStatus } from '../enums/approval-status.enum';

/** Enriched approval request with related entity names */
export interface EnrichedApprovalRequest {
    id: number;
    vendorId: number;
    branchId: number;
    serviceId: number | null;
    requestType: string;
    status: ApprovalStatus;
    oldValue: string | null;
    newValue: string;
    reason: string | null;
    createdAt: Date;
    reviewedBy: number | null;
    reviewNotes: string | null;
    reviewedAt: Date | null;
    vendorName: string;
    branchName: string;
    serviceName: string | null;
}

export interface IApprovalRequestRepository {
    findById(id: number): Promise<any | null>;
    findByStatus(status: ApprovalStatus): Promise<EnrichedApprovalRequest[]>;
    save(request: any): Promise<void>;
}
