import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../infrastructure/auth/strategies/jwt.strategy';
import { GoogleStrategy } from '../infrastructure/auth/strategies/google.strategy';
import { ApplicationModule } from './application.module';

@Module({
    imports: [
        PassportModule,
        ApplicationModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET || 'atspaces-super-secret-key-change-this-in-production',
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule { }
