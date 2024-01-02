import { Module } from '@nestjs/common';
import { CostController } from './cost.controller';
import { CostService } from '../service/cost/cost.service';
import { LoggerModule } from '@/logger/logger.module';
import { Cost } from '@/database/entity/cost/cost.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cost]), LoggerModule],
  providers: [CostService],
  controllers: [CostController],
})
export class CostModule {}
