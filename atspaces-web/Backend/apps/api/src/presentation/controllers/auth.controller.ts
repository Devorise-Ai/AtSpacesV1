import { Controller, Post, Body, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered.' })
    async register(@Body() registrationDto: any) {
        return this.authService.register(registrationDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful, returns JWT.' })
    async login(@Body() loginDto: any) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return this.authService.login(user);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Login with Google' })
    async googleAuth(@Req() req) {
        // This triggers the Google OAuth2 flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google auth callback' })
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.authService.validateGoogleUser(req.user);
        const loginResult = await this.authService.login(user);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const userEncoded = encodeURIComponent(JSON.stringify(loginResult.user));
        // Redirect to the frontend with token and user in query params
        return res.redirect(
            `${frontendUrl}/auth/callback?token=${loginResult.access_token}&user=${userEncoded}`
        );
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Req() req) {
        return req.user;
    }
}
