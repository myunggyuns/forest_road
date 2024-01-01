import { Inject, Injectable } from '@nestjs/common';

import { RedisRepository } from '@/redis/redis.repository';

const oneDayInSeconds = 60 * 60 * 24;
const tenMinutesInSeconds = 60 * 10;

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async saveProduct(productId: string, productData: any): Promise<void> {
    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      'test',
      productId,
      JSON.stringify(productData),
      oneDayInSeconds,
    );
  }

  async getProduct(productId: string): Promise<any | null> {
    const product = await this.redisRepository.get('test', productId);
    return JSON.parse(product);
  }

  async saveResetToken(userId: string, token: string): Promise<void> {
    // Expiry is set to 10 minutes
    await this.redisRepository.setWithExpiry(
      'test',
      token,
      userId,
      tenMinutesInSeconds,
    );
  }

  async getResetToken(token: string): Promise<string | null> {
    return await this.redisRepository.get('test', token);
  }
}
