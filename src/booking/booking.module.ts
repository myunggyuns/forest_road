import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '@/database/entity/booking/booking.entity';
import { User } from '@/database/entity/user/user.entity';
// import { bookingProviders } from 'src/database/entity/booking/booking.providers';
// import { userProviders } from 'src/database/entity/user/user.providers';
import { BookingController } from './booking.controller';
import { BookingService } from '../service/booking/booking.service';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User]), LoggerModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
