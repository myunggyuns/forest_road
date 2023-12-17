import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingService {
  constructor(private readonly configService: ConfigService) {}
  list() {}
  concertDate() {}
  concertSeat() {}
  booking() {}
}
