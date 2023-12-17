import { Module } from '@nestjs/common';
import { roomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  providers: [RoomService],
  controllers: [roomController],
})
export class RoomModule {}
