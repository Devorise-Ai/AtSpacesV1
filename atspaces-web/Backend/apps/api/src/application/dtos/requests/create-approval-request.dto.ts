import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestType } from '../../../domain/enums/request-type.enum';

export class CreateApprovalRequestDto {
    @IsInt()
    branchId: number;

    @IsOptional()
    @IsInt()
    serviceId?: number;

    @IsEnum(RequestType)
    requestType: RequestType;

    @IsOptional()
    @IsString()
    oldValue?: string;

    @IsNotEmpty()
    @IsString()
    newValue: string;

    @IsOptional()
    @IsString()
    reason?: string;
}
