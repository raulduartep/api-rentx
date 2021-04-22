import { RateLimiterRedis } from 'rate-limiter-flexible';
import { RedisClient } from 'redis';
import { inject, injectable } from 'tsyringe';

import { IRateLimiter } from '../IRateLimiter';

@injectable()
class RateLimiterFlexible implements IRateLimiter {
  private limiter: RateLimiterRedis;

  constructor(
    @inject('RedisClient')
    private redisClient: RedisClient
  ) {
    this.limiter = new RateLimiterRedis({
      storeClient: this.redisClient,
      keyPrefix: 'rateLimiter',
      points: 10,
      duration: 5,
    });
  }

  async verify(ip: string): Promise<void> {
    await this.limiter.consume(ip);
  }
}

export { RateLimiterFlexible };
