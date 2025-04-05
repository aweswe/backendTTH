import { Module } from '@nestjs/common';
import { PdfThemeService } from './pdf-theme.service';
import { PdfThemeController } from './pdf-theme.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'pdf-generation',
    }),
  ],
  providers: [PdfThemeService],
  controllers: [PdfThemeController],
  exports: [PdfThemeService],
})
export class PdfThemeModule {} 