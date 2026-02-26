import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    private mapPrismaToEntity(prismaUser: any): User {
        return new User({
            id: prismaUser.id,
            fullName: prismaUser.fullName,
            email: prismaUser.email,
            phoneNumber: prismaUser.phoneNumber,
            passwordHash: prismaUser.passwordHash,
            role: prismaUser.role as UserRole,
            status: prismaUser.status as UserStatus,
            isPhoneVerified: prismaUser.isPhoneVerified,
            isEmailVerified: prismaUser.isEmailVerified,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        });
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.mapPrismaToEntity(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? this.mapPrismaToEntity(user) : null;
    }

    async findByPhone(phone: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { phoneNumber: phone } });
        return user ? this.mapPrismaToEntity(user) : null;
    }

    async create(user: Partial<User>): Promise<User> {
        const createdUser = await this.prisma.user.create({
            data: {
                fullName: user.fullName!,
                email: user.email,
                phoneNumber: user.phoneNumber,
                passwordHash: user.passwordHash,
                role: user.role! as any,
                status: (user.status || 'pending') as any,
            },
        });
        return this.mapPrismaToEntity(createdUser);
    }

    async update(id: number, user: Partial<User>): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                passwordHash: user.passwordHash,
                role: user.role as any,
                status: user.status as any,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified,
            },
        });
        return this.mapPrismaToEntity(updatedUser);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}
