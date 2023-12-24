import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  //client polling 처리
  waiting() {
    // console.log(this.room);
  }

  //client 결제 처리
  progress() {}
}
