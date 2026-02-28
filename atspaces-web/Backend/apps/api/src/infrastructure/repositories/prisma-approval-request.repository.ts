import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalRequest } from '../../domain/entities/approval-request.entity';
import { IApprovalRequestRepository, EnrichedApprovalRequest } from '../../domain/interfaces/approval-request-repository.interface';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';
import { RequestType } from '../../domain/enums/request-type.enum';

@Injectable()
export class PrismaApprovalRequestRepository implements IApprovalRequestRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapPrismaToEntity(prismaReq: any): ApprovalRequest {
        return new ApprovalRequest(
            prismaReq.id,
            prismaReq.vendorId,
            prismaReq.branchId,
            prismaReq.serviceId,
            prismaReq.requestType as RequestType,
            prismaReq.oldValue,
            prismaReq.newValue,
            prismaReq.reason,
            prismaReq.status as ApprovalStatus,
            prismaReq.createdAt,
            prismaReq.reviewedBy,
            prismaReq.reviewNotes,
            prismaReq.reviewedAt
        );
    }

    async findById(id: number): Promise<ApprovalRequest | null> {
        const req = await this.prisma.approvalRequest.findUnique({ where: { id } });
        return req ? this.mapPrismaToEntity(req) : null;
    }

    async findByStatus(status: ApprovalStatus): Promise<EnrichedApprovalRequest[]> {
        const reqs = await this.prisma.approvalRequest.findMany({
            where: { status: status as any },
            include: {
                vendor: { select: { fullName: true } },
                branch: { select: { name: true } },
                service: { select: { name: true } }
            }
        });
        return reqs.map(r => ({
            id: r.id,
            vendorId: r.vendorId,
            branchId: r.branchId,
            serviceId: r.serviceId,
            requestType: r.requestType,
            oldValue: r.oldValue,
            newValue: r.newValue,
            reason: r.reason,
            status: r.status as unknown as ApprovalStatus,
            createdAt: r.createdAt,
            reviewedBy: r.reviewedBy,
            reviewNotes: r.reviewNotes,
            reviewedAt: r.reviewedAt,
            vendorName: r.vendor.fullName,
            branchName: r.branch.name,
            serviceName: r.service?.name || null
        }));
    }

    async save(request: ApprovalRequest): Promise<void> {
        await this.prisma.approvalRequest.upsert({
            where: { id: request.id || 0 },
            update: {
                status: request.status as any,
                reviewedBy: request.reviewedBy,
                reviewNotes: request.reviewNotes,
                reviewedAt: request.reviewedAt,
            },
            create: {
                vendorId: request.vendorId,
                branchId: request.branchId,
                serviceId: request.serviceId,
                requestType: request.requestType as any,
                oldValue: request.oldValue,
                newValue: request.newValue,
                reason: request.reason,
                status: request.status as any,
            },
        });
    }
}
