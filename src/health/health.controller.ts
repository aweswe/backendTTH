import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './indicators/database.health';
// import { RedisHealthIndicator } from './indicators/redis.health';
import { BullHealthIndicator } from './indicators/bull.health';
import { AiHealthIndicator } from './indicators/ai.health';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: DatabaseHealthIndicator,
    // private redis: RedisHealthIndicator,
    private bull: BullHealthIndicator,
    private ai: AiHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check system health' })
  check() {
    return this.health.check([
      // Database checks
      () => this.db.checkPrisma('prisma_db'),
      () => this.db.checkSupabase('supabase_db'),
      
      // Cache and queue checks
      // () => this.redis.isHealthy('redis'),
      () => this.bull.isHealthy('bull'),
      
      // External service checks
      () => this.ai.checkOpenAI('openai'),
      () => this.ai.checkDeepSeek('deepseek'),
      
      // System checks
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024), // 150MB
      () => this.disk.checkStorage('disk', { 
        thresholdPercent: 0.9, 
        path: '/' 
      }),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check if application is live' })
  checkLiveness() {
    return this.health.check([
      () => this.db.isConnected('database'),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: 'Check if application is ready to serve traffic' })
  checkReadiness() {
    return this.health.check([
      () => this.db.checkPrisma('prisma_db'),
      () => this.db.checkSupabase('supabase_db'),
      // () => this.redis.isHealthy('redis'),
      () => this.bull.isHealthy('bull'),
    ]);
  }
} 