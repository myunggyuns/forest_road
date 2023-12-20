import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get('list')
  list() {
    return this.bookingService.list();
  }

  @Get(':id')
  concertDate(@Param('id') id: string) {
    return this.bookingService.concertDate(id);
  }

  @Get(':id/:date')
  concertSeat(@Param() param: string[]) {
    return this.bookingService.concertSeat(param['id'], param['date']);
  }

  @Post()
  booking() {
    return this.bookingService.booking();
  }

  @Post('create')
  createConcert(@Request() req: Request) {
    const { body } = req;
    console.log(body)
    return this.bookingService.createConcert(body);
  }
}
