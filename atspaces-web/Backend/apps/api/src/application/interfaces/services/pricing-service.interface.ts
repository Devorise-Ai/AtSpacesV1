import { Money } from '../../../domain/value-objects/money.vo';

export interface IPricingService {
    calculatePrice(vendorServiceId: number, start: Date, end: Date): Promise<Money>;
    getAvailablePrices(vendorServiceId: number): Promise<Money[]>;
}
