import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomService {
  constructor(private readonly configService: ConfigService) {}
  waiting() {}
  progress() {}
}
