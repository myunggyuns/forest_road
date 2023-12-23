import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { bookingProviders } from 'src/database/entity/booking/booking.providers';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [DatabaseModule],
  providers: [BookingService, ...bookingProviders],
  controllers: [BookingController],
})
export class BookingModule {}
