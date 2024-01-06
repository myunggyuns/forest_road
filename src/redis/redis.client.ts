import Redis from 'ioredis';
import { FactoryProvider } from '@nestjs/common';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env['REDIS_HOST'],
      port: Number(process.env['REDIS_PORT']),
    });
    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection faild: ${e}`);
    });
    return redisInstance;
  },
  inject: [],
};
