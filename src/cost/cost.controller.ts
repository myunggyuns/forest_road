import { Controller, Get, Post, Request } from '@nestjs/common';
import { CostService } from '../service/cost/cost.service';

@Controller('cost')
export class CostController {
  constructor(private readonly costService: CostService) {}
  @Get()
  remainCost() {
    return this.costService.remainCost();
  }

  @Post('payment')
  payment(@Request() req: Request) {
    const { body } = req;
    return this.costService.payment(body);
  }

  @Post('charge')
  charge(@Request() req: Request) {
    const { body } = req;
    return this.costService.charge(body);
  }

  @Post('create')
  create(@Request() req: Request) {
    const { body } = req;
    return this.costService.createCharge(body);
  }
}
