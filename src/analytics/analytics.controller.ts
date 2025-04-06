import {
  Controller,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ParseDatePipe } from './pipes/parse-date.pipe';

// Create instance of the pipe outside the class
const parseDatePipe = new ParseDatePipe();

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles('admin')
  @ApiOperation({ summary: 'Get overview statistics' })
  @ApiResponse({ status: 200, description: 'Return overview statistics' })
  getOverviewStats() {
    return this.analyticsService.getOverviewStats();
  }

  @Get('timeline')
  @Roles('admin')
  @ApiOperation({ summary: 'Get sales timeline data' })
  @ApiResponse({ status: 200, description: 'Return timeline data' })
  @ApiQuery({ name: 'startDate', type: Date, required: true })
  @ApiQuery({ name: 'endDate', type: Date, required: true })
  getSalesTimeline(
    @Query('startDate', parseDatePipe) startDate: Date,
    @Query('endDate', parseDatePipe) endDate: Date,
  ) {
    return this.analyticsService.getSalesTimeline(startDate, endDate);
  }

  @Get('team-performance')
  @Roles('admin')
  @ApiOperation({ summary: 'Get team performance metrics' })
  @ApiResponse({ status: 200, description: 'Return team performance data' })
  @ApiQuery({ name: 'startDate', type: Date, required: true })
  @ApiQuery({ name: 'endDate', type: Date, required: true })
  getTeamPerformance(
    @Query('startDate', parseDatePipe) startDate: Date,
    @Query('endDate', parseDatePipe) endDate: Date,
  ) {
    return this.analyticsService.getTeamPerformance(startDate, endDate);
  }

  @Get('lead-sources')
  @Roles('admin')
  @ApiOperation({ summary: 'Get lead source distribution' })
  @ApiResponse({ status: 200, description: 'Return lead source data' })
  getLeadSources() {
    return this.analyticsService.getLeadSources();
  }

  @Get('ai-insights')
  @Roles('admin')
  @ApiOperation({ summary: 'Get AI-generated insights' })
  @ApiResponse({ status: 200, description: 'Return AI insights' })
  getAiInsights() {
    return this.analyticsService.getAiInsights();
  }
} 