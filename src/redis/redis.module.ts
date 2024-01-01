import { RedisService } from '@/service/redis/redis.service';
import { Module } from '@nestjs/common';

import { redisClientFactory } from './redis.client';
import { RedisRepository } from './redis.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository, RedisService],

  exports: [RedisService],
})
export class RedisModule {}
