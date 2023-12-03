import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  private port = this.config.get<string>('PORT');
  heartBeat(): string {
    return `Listen to my Heart Beat! PORT: ${this.port}`;
  }
}
