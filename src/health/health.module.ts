import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './indicators/database.health';
// import { RedisHealthIndicator } from './indicators/redis.health';
import { BullHealthIndicator } from './indicators/bull.health';
import { AiHealthIndicator } from './indicators/ai.health';
import { DatabaseModule } from '../database/database.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    DatabaseModule,
    BullModule.registerQueue({
      name: 'default',
    }),
  ],
  controllers: [HealthController],
  providers: [
    DatabaseHealthIndicator,
    // RedisHealthIndicator, // Commented out Redis health check
    BullHealthIndicator,
    AiHealthIndicator,
  ],
})
export class HealthModule {} 