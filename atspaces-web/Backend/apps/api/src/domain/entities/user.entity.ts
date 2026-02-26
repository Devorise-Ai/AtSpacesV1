export enum UserRole {
    CUSTOMER = 'customer',
    VENDOR = 'vendor',
    ADMIN = 'admin',
}

export enum UserStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
}

export class User {
    id: number;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    passwordHash?: string;
    role: UserRole;
    status: UserStatus;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}
