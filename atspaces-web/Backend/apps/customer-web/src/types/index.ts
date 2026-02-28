// ── Workspace / Branch Types ───────────────────────────────────────

export interface Facility {
    id: number;
    name: string;
}

export interface BranchFacility {
    facility: Facility;
}

export interface Service {
    id: number;
    name: string; // 'hot_desk' | 'dedicated_desk' | 'private_office' | 'meeting_room'
}

export interface VendorService {
    id: number;
    service: Service;
    pricePerUnit: number;
    maxCapacity: number | null;
    isActive: boolean;
}

export interface Branch {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    description: string | null;
    images: string[] | null;
    rating: number | null;
    reviewsCount: number | null;
    latitude: number | null;
    longitude: number | null;
    branchFacilities: BranchFacility[];
    vendorServices: VendorService[];
}

/** Detailed branch view for the workspace details page */
export interface BranchDetail extends Branch {
    // Inherits all fields from Branch
}
/** Flattened workspace card used in the UI */
export interface WorkspaceCard {
    /** Unique card identifier (composite key for React lists) */
    id: string;
    /** Branch ID for navigation */
    branchId: number;
    /** Service ID for booking */
    serviceId: number;
    title: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    capacity: string;
    image: string;
    amenities: string[];
    type: string;
    description: string | null;
    lat: number;
    lng: number;
}

// ── Booking Types ──────────────────────────────────────────────────

export type BookingStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'NO_SHOW';

export interface Booking {
    id: number;
    bookingNumber: string;
    status: BookingStatus;
    startTime: string;
    endTime: string;
    totalPrice: number;
    paymentMethod: string;
    notes: string | null;
    createdAt: string;
    vendorService: {
        service: Service;
        pricePerUnit: number;
    };
    branch: {
        id: number;
        name: string;
        address: string | null;
        city: string | null;
    };
}

// ── Auth Types ─────────────────────────────────────────────────────

export interface User {
    id: number;
    name: string | null;
    phone: string;
    email: string | null;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

// ── Create Booking DTO ─────────────────────────────────────────────

export interface CreateBookingDto {
    vendorServiceId: number;
    startTime: string;
    endTime: string;
    paymentMethod: 'CREDIT_CARD' | 'EWALLET' | 'CASH';
    notes?: string;
}
