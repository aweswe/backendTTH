import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const result = await this.redis.ping();
      return this.getStatus(key, result === 'PONG');
    } catch (error) {
      throw new HealthCheckError('Redis check failed', this.getStatus(key, false, { error: error.message }));
    }
  }
} 