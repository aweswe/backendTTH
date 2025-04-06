import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DatabaseMetricsService } from './metrics/database.metrics';

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly databaseMetrics: DatabaseMetricsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get basic system metrics' })
  async getBasicMetrics() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('database')
  @ApiOperation({ summary: 'Get database metrics' })
  async getDatabaseMetrics() {
    try {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        users: await this.databaseMetrics.getUserMetrics(),
        leads: await this.databaseMetrics.getLeadMetrics(),
        itineraries: await this.databaseMetrics.getItineraryMetrics(),
        notifications: await this.databaseMetrics.getNotificationMetrics(),
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: error.message,
      };
    }
  }
} 