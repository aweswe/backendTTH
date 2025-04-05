import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'leads',
    }),
    AiModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {} 