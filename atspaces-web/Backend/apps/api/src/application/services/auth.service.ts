import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { UserRole, UserStatus } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.passwordHash && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }

    async register(registrationDto: any) {
        const hashedPassword = await bcrypt.hash(registrationDto.password, 10);
        const user = await this.userRepository.create({
            email: registrationDto.email,
            passwordHash: hashedPassword,
            fullName: registrationDto.fullName,
            phoneNumber: registrationDto.phoneNumber,
            role: (registrationDto.role as UserRole) || UserRole.CUSTOMER,
            status: UserStatus.ACTIVE, // For Phase 1/2, we bypass pending/approval
        });

        const { passwordHash, ...result } = user;
        return result;
    }

    async validateGoogleUser(googleProfile: any) {
        const { email, firstName, lastName } = googleProfile;
        const fullName = `${firstName} ${lastName}`;

        let user = await this.userRepository.findByEmail(email);

        if (!user) {
            user = await this.userRepository.create({
                email,
                fullName: fullName,
                role: 'customer' as any,
                status: 'active' as any,
                passwordHash: undefined, // Google users don't have a local password initially
            });
        }

        return user;
    }
}
