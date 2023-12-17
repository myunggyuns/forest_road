import { Controller, Post } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class roomController {
  constructor(private readonly roomService: RoomService) {}
  @Post('waiting')
  waiting() {
    return this.roomService.waiting();
  }

  @Post('progress')
  progress() {
    return this.roomService.progress();
  }
}
