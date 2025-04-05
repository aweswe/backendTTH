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
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Leads')
@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Get all leads' })
  @ApiResponse({ status: 200, description: 'Return all leads' })
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Get a lead by id' })
  @ApiResponse({ status: 200, description: 'Return the lead' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.leadsService.remove(id);
  }

  @Post(':id/notes')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Add a note to a lead' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  addNote(
    @Param('id', ParseUUIDPipe) leadId: string,
    @Body('content') content: string,
    @Body('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.leadsService.addNote(leadId, content, userId);
  }

  @Post(':id/summary')
  @Roles('admin', 'sales')
  @ApiOperation({ summary: 'Generate AI summary for a lead' })
  @ApiResponse({ status: 200, description: 'AI summary generated successfully' })
  generateAiSummary(@Param('id', ParseUUIDPipe) leadId: string) {
    return this.leadsService.generateAiSummary(leadId);
  }
} 