import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CostService {
  constructor(private readonly configService: ConfigService) {}
  remainCost() {}
  payment() {}
  charge() {}
}
