import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { DatabaseMetricsService } from './metrics/database.metrics';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [MetricsController],
  providers: [
    DatabaseMetricsService,
  ],
  exports: [
    DatabaseMetricsService,
  ],
})
export class MetricsModule {} 