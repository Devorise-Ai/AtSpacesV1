export class VendorService {
    id: number;
    branchId: number;
    serviceId: number;
    isAvailable: boolean;
    maxCapacity: number;
    pricePerUnit: number;
    priceUnit: string;
    minBookingDuration: number;
    maxBookingDuration?: number;
    cancellationPolicy?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<VendorService>) {
        Object.assign(this, data);
    }
}
