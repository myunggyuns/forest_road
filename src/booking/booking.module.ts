import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/database/entity/booking/booking.entity';
import { User } from 'src/database/entity/user/user.entity';
// import { bookingProviders } from 'src/database/entity/booking/booking.providers';
// import { userProviders } from 'src/database/entity/user/user.providers';
import { RoomService } from 'src/room/room.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  providers: [RoomService, BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
