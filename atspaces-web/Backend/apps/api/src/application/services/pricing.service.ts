import { Injectable, Inject } from '@nestjs/common';
import { Money } from '../../domain/value-objects/money.vo';
import { BusinessException } from '../exceptions/business.exception';
import type { IVendorServiceRepository } from '../../domain/interfaces/vendor-service-repository.interface';
import type { IPricingService } from '../interfaces/services/pricing-service.interface';

@Injectable()
export class PricingService implements IPricingService {
    constructor(
        @Inject('IVendorServiceRepository') private readonly vendorServiceRepository: IVendorServiceRepository,
    ) { }

    async calculatePrice(vendorServiceId: number, start: Date, end: Date): Promise<Money> {
        const vendorService = await this.vendorServiceRepository.findById(vendorServiceId);

        if (!vendorService) {
            throw new BusinessException('Vendor service not found');
        }

        const duration = this.getDurationInUnit(start, end, vendorService.priceUnit);

        if (vendorService.minBookingDuration && duration < vendorService.minBookingDuration) {
            throw new BusinessException(`Minimum duration is ${vendorService.minBookingDuration} ${vendorService.priceUnit}`);
        }

        if (vendorService.maxBookingDuration && duration > vendorService.maxBookingDuration) {
            throw new BusinessException(`Maximum duration is ${vendorService.maxBookingDuration} ${vendorService.priceUnit}`);
        }

        const basePrice = Money.create(vendorService.pricePerUnit, 'JOD');
        return basePrice.multiply(duration);
    }

    async getAvailablePrices(vendorServiceId: number): Promise<Money[]> {
        const vendorService = await this.vendorServiceRepository.findById(vendorServiceId);
        if (!vendorService) return [];
        return [Money.create(vendorService.pricePerUnit, 'JOD')];
    }

    private getDurationInUnit(start: Date, end: Date, unit: string): number {
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        return unit === 'hour' ? Math.ceil(diffHours) : Math.ceil(diffHours / 24); // basic logic
    }
}
