import { VendorService } from '../entities/vendor-service.entity';

export interface IVendorServiceRepository {
    findById(id: number): Promise<VendorService | null>;
    findByBranchId(branchId: number): Promise<VendorService[]>;
    save(vendorService: Partial<VendorService>): Promise<VendorService>;
    update(id: number, vendorService: Partial<VendorService>): Promise<VendorService>;
    delete(id: number): Promise<void>;
}
