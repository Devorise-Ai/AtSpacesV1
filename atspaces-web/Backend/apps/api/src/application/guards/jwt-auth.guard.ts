import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard.
 * Apply with @UseGuards(JwtAuthGuard) to protect routes.
 * Requires a valid Bearer token in the Authorization header.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
