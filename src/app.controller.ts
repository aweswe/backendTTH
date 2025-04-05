import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-test')
  async testDbConnection() {
    try {
      // Test Prisma connection
      const prismaStatus = await this.prisma.$queryRaw`SELECT 1 as status`;
      
      // Test Supabase connection
      const { data, error } = await this.supabase.from('_prisma_migrations').select('*').limit(1);
      
      return {
        message: 'Database connection test',
        prismaConnected: !!prismaStatus,
        supabaseConnected: !error,
        prismaResult: prismaStatus,
        supabaseResult: { data, error },
      };
    } catch (error) {
      return {
        message: 'Database connection test failed',
        error: error.message,
        stack: error.stack,
      };
    }
  }
}
