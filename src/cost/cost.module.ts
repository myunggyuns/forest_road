import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { costProviders } from '@/database/entity/cost/cost.providers';
import { CostController } from './cost.controller';
import { CostService } from './cost.service';

@Module({
  imports: [DatabaseModule],
  providers: [CostService, ...costProviders],
  controllers: [CostController],
})
export class CostModule {}
