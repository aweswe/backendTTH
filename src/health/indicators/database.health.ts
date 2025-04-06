import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';
import { Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(
    private prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {
    super();
  }

  async checkPrisma(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Prisma check failed',
        this.getStatus(key, false, { error: error.message }),
      );
    }
  }

  async checkSupabase(key: string): Promise<HealthIndicatorResult> {
    try {
      const { data, error } = await this.supabase.from('_prisma_migrations').select('*').limit(1);
      if (error) throw error;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Supabase check failed',
        this.getStatus(key, false, { error: error.message }),
      );
    }
  }

  async isConnected(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const { error } = await this.supabase.from('_prisma_migrations').select('*').limit(1);
      return this.getStatus(key, !error);
    } catch (error) {
      return this.getStatus(key, false, { error: error.message });
    }
  }
} 