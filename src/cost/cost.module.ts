import { Module } from '@nestjs/common';
import { CostController } from './cost.controller';
import { CostService } from '../service/cost/cost.service';
import { LoggerModule } from '@/logger/logger.module';
import { Cost } from '@/database/entity/cost/cost.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cost]),
    LoggerModule,
    JwtModule.register({
      global: true,
      secret: 'salt',
      signOptions: { expiresIn: '60s' },
    }),
    RedisModule,
  ],
  providers: [CostService],
  controllers: [CostController],
})
export class CostModule {}
