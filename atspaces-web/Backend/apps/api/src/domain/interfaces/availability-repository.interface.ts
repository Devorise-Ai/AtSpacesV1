export interface IAvailabilityRepository {
    checkAvailability(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<boolean>;
    decreaseUnits(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<void>;
    increaseUnits(vendorServiceId: number, start: Date, end: Date, quantity: number): Promise<void>;
}
