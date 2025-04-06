import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AiErrorTrackerService } from './ai-error-tracker.service';
import { AiErrorSupabaseRepository } from './ai-error-supabase.repository';

@Injectable()
export class AiErrorTrackerFactory {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private aiErrorRepo: AiErrorSupabaseRepository,
  ) {}

  create(): AiErrorTrackerService {
    return new AiErrorTrackerService(
      this.configService,
      this.prisma,
      this.aiErrorRepo,
    );
  }
} 