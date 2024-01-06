import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisRepositoryInterface } from './redis.interface';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}
  onModuleDestroy() {
    this.redisClient.disconnect();
  }
  get(prefix: string, key: string): Promise<string> {
    return this.redisClient.get(`${prefix}:${key}`);
  }
  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }
  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }
  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  async zadd(prefix: string, score: number, value: string) {
    await this.redisClient.zadd(`${prefix}`, score, `${value}`);
  }
  async zrank(key: string, value: string) {
    return await this.redisClient.zrank(key, value);
  }
  async zrange(key: string) {
    return await this.redisClient.zrange(key, 0, -1);
  }
  async zrem(key: string, value: string) {
    return await this.redisClient.zrem(key, value);
  }
  async zscan(key: string, value: number) {
    this.redisClient.zscan(key, value);
  }
}
