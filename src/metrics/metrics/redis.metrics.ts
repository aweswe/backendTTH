import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge } from 'prom-client';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisMetrics {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectMetric('redis_commands_total')
    private readonly commandsCounter: Counter<string>,
    @InjectMetric('redis_command_duration_seconds')
    private readonly commandDuration: Gauge<string>,
    @InjectMetric('redis_memory_usage_bytes')
    private readonly memoryUsage: Gauge<string>,
  ) {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Track total commands
    this.commandsCounter.inc(0);
    
    // Track command duration
    this.commandDuration.set(0);
    
    // Track memory usage
    this.memoryUsage.set(0);
  }

  async trackCommand(duration: number) {
    this.commandsCounter.inc();
    this.commandDuration.set(duration);
  }

  async updateMemoryUsage() {
    const info = await this.redis.info('memory');
    const usedMemory = info.match(/used_memory:(\d+)/)?.[1];
    if (usedMemory) {
      this.memoryUsage.set(parseInt(usedMemory));
    }
  }

  async getRedisStats() {
    return {
      connections: 0,
      operationsPerSecond: 0,
      memoryUsage: 0,
      uptime: 0,
    };
  }
} 