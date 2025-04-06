import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BullHealthIndicator extends HealthIndicator {
  constructor(
    @InjectQueue('default') private readonly queue: Queue,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const client = this.queue.client;
      const isHealthy = client.status === 'ready';
      return this.getStatus(key, isHealthy, { status: client.status });
    } catch (error) {
      throw new HealthCheckError('Bull check failed', this.getStatus(key, false, { error: error.message }));
    }
  }
} 