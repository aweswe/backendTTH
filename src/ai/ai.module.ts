import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiCacheService } from './ai-cache.service';
import { AiErrorTrackerService } from './ai-error-tracker.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AiErrorSupabaseRepository } from './ai-error-supabase.repository';
import { AiErrorTrackerFactory } from './ai-error-tracker.factory';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PrismaModule,
    SupabaseModule,
  ],
  providers: [
    AiService,
    AiCacheService,
    AiErrorTrackerService,
    AiErrorSupabaseRepository,
    AiErrorTrackerFactory,
  ],
  exports: [
    AiService,
    AiCacheService,
    AiErrorTrackerService
  ],
})
export class AiModule {} 