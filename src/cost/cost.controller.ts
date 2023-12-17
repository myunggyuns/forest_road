import { Controller, Get, Post } from '@nestjs/common';
import { CostService } from './cost.service';

@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}
  @Get()
  remainCost() {
    return this.costService.remainCost();
  }

  @Post('payment')
  payment() {
    return this.costService.payment();
  }

  @Post('charge')
  charge() {
    return this.costService.charge();
  }
}
