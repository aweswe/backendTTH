import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { PdfThemeService } from './pdf-theme.service';

@ApiTags('PDF Themes')
@Controller('pdf-themes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PdfThemeController {
  constructor(private readonly pdfThemeService: PdfThemeService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new PDF theme' })
  create(@Body() data: any) {
    return this.pdfThemeService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PDF themes' })
  findAll() {
    return this.pdfThemeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PDF theme by ID' })
  findOne(@Param('id') id: string) {
    return this.pdfThemeService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a PDF theme' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.pdfThemeService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a PDF theme' })
  remove(@Param('id') id: string) {
    return this.pdfThemeService.remove(id);
  }
} 