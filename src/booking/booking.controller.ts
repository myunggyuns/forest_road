import { Controller, Get, Post } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('list')
  list() {
    return this.bookingService.list();
  }

  @Get(':id')
  concertDate() {
    return this.bookingService.concertDate();
  }

  @Get(':id/:seatId')
  concertSeat() {
    return this.bookingService.concertSeat();
  }

  @Post()
  booking() {
    return this.bookingService.booking();
  }
}
