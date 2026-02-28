import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateBookingDto } from '../../application/dtos/requests/create-booking.dto';
import { BookingService } from '../../application/services/booking.service';
import { JwtAuthGuard } from '../../application/guards/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingService: BookingService) { }

    @Post()
    async create(
        @Body() dto: CreateBookingDto,
        @Req() req: any,
    ) {
        const customerId = req.user?.id;
        return this.bookingService.createBooking(dto, Number(customerId));
    }

    @Get('my')
    async getMyBookings(@Req() req: any) {
        const customerId = req.user?.id;
        return this.bookingService.findByCustomer(Number(customerId));
    }

    @Get('vendor')
    async getVendorBookings(@Req() req: any) {
        const userRole = req.user?.role;
        const userId = req.user?.id;

        // Only vendors and admins can access vendor bookings
        if (userRole !== 'vendor' && userRole !== 'admin') {
            throw new ForbiddenException('Only vendors and admins can access vendor bookings');
        }

        return this.bookingService.findByVendor(Number(userId));
    }

    @Patch(':id/cancel')
    async cancel(
        @Param('id', ParseIntPipe) id: number,
        @Body('reason') reason: string,
        @Req() req: any,
    ) {
        const userId = req.user?.id;
        return this.bookingService.cancelBooking(id, Number(userId), reason);
    }

    @Patch(':id/check-in')
    async checkIn(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ) {
        const vendorId = req.user?.id;
        return this.bookingService.checkIn(id, Number(vendorId));
    }

    @Patch(':id/no-show')
    async markNoShow(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ) {
        const vendorId = req.user?.id;
        return this.bookingService.markNoShow(id, Number(vendorId));
    }
}
