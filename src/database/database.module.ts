import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase configuration');
        }

        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
          db: {
            schema: 'public',
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'SUPABASE_ANON_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseAnonKey = configService.get<string>('SUPABASE_ANON_KEY');
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase configuration');
        }

        return createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
          },
          db: {
            schema: 'public',
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService, 'SUPABASE_CLIENT', 'SUPABASE_ANON_CLIENT'],
})
export class DatabaseModule {} 