import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(private readonly configService: ConfigService) {}

  signup(body) {
    if (!body.nickName || !body.email || !body.password) {
      return new Error('Invalid User');
    }
  }
  signin(body) {
    if (!body.nickName || !body.email || !body.password) {
      return new Error('Invalid User');
    }
  }
  getToken() {}
}
