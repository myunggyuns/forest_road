import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { costProviders } from '@/database/entity/cost/cost.providers';
import { CostController } from './cost.controller';
import { CostService } from '../service/cost/cost.service';
import { LoggerModule } from '@/logger/logger.module';

@Module({
  imports: [DatabaseModule, LoggerModule],
  providers: [CostService, ...costProviders],
  controllers: [CostController],
})
export class CostModule {}
