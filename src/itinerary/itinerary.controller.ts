import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Itinerary')
@Controller('itinerary')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ItineraryController {
  constructor(private readonly itineraryService: ItineraryService) {}

  @Post()
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Create a new itinerary' })
  @ApiResponse({ status: 201, description: 'Itinerary created successfully' })
  create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itineraryService.create(createItineraryDto);
  }

  @Get()
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Get all itineraries' })
  @ApiResponse({ status: 200, description: 'Return all itineraries' })
  findAll() {
    return this.itineraryService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Get an itinerary by id' })
  @ApiResponse({ status: 200, description: 'Return the itinerary' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.itineraryService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Update an itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itineraryService.update(id, updateItineraryDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete an itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.itineraryService.remove(id);
  }

  @Get(':id/pdf')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Generate PDF for an itinerary' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully' })
  generatePdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('theme') theme?: string,
  ) {
    return this.itineraryService.generatePdf(id, theme);
  }

  @Post(':id/optimize')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Optimize itinerary route' })
  @ApiResponse({ status: 200, description: 'Route optimized successfully' })
  optimizeRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.itineraryService.optimizeRoute(id);
  }

  @Get(':id/cost')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Calculate itinerary cost' })
  @ApiResponse({ status: 200, description: 'Cost calculated successfully' })
  calculateCost(@Param('id', ParseUUIDPipe) id: string) {
    return this.itineraryService.calculateCost(id);
  }
} 