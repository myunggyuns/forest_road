import { Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('list')
  list() {
    return this.bookingService.list();
  }

  @Get(':id')
  concertDate(@Param('id') id: string, @Query('date') date: string) {
    if (date) {
      return this.bookingService.concertSeat(id, date);
    } else {
      return this.bookingService.concertDate(id);
    }
  }

  @Post()
  booking() {
    return this.bookingService.booking();
  }

  @Post('create')
  createConcert(@Request() req: Request) {
    const { body } = req;
    return this.bookingService.createConcert(body);
  }
}
