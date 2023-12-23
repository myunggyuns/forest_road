import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoomService {
  constructor(private readonly configService: ConfigService) {}
  //client polling 처리
  waiting() {}

  //client 결제 처리
  progress() {}
}
