import { Module } from '@nestjs/common';
import { CostController } from './cost.controller';
import { CostService } from './cost.service';

@Module({ providers: [CostService], controllers: [CostController] })
export class CostModule {}
