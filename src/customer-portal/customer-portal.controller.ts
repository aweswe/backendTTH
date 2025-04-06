import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Customer Portal')
@Controller('customer-portal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CustomerPortalController {
  @Get('itineraries')
  @ApiOperation({ summary: 'Get customer itineraries' })
  async getItineraries() {
    return [];
  }

  @Get('itineraries/:id')
  @ApiOperation({ summary: 'Get customer itinerary by ID' })
  async getItinerary(@Param('id') id: string) {
    return {};
  }

  @Post('feedback')
  @ApiOperation({ summary: 'Submit customer feedback' })
  async submitFeedback(@Body() feedback: any) {
    return {};
  }
} 