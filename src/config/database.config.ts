import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService) => ({
  supabase: createClient(
    configService.get<string>('SUPABASE_URL'),
    configService.get<string>('SUPABASE_ANON_KEY'),
    {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
      },
    },
  ),
});

export const DATABASE_CONFIG = 'DATABASE_CONFIG'; 