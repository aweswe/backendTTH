import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { AiModule } from '../ai/ai.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'itinerary',
    }),
    AiModule,
    PdfModule,
  ],
  controllers: [ItineraryController],
  providers: [ItineraryService],
  exports: [ItineraryService],
})
export class ItineraryModule {} 