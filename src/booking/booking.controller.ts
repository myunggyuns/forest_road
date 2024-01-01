import { Controller, Get, Param, Post, Query, Request } from '@nestjs/common';
import { BookingService } from '../service/booking/booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('concertlist')
  concertList() {
    return this.bookingService.concertList();
  }

  @Post('status')
  roomStatus(@Request() req: Request) {
    const { body } = req;
    return this.bookingService.roomStatus(body);
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
  booking(@Request() req: Request) {
    const { body } = req;
    return this.bookingService.booking(body);
  }

  @Post('create')
  createConcert(@Request() req: Request) {
    const { body } = req;
    return this.bookingService.createConcert(body);
  }
}
