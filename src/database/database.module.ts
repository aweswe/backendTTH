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
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_ANON_KEY');
        
        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Missing Supabase configuration');
        }
        
        return createClient(supabaseUrl, supabaseKey, {
          db: {
            schema: 'public',
          },
          auth: {
            persistSession: false,
          },
        });
      },
    },
  ],
  exports: [PrismaService, 'SUPABASE_CLIENT'],
})
export class DatabaseModule {} 