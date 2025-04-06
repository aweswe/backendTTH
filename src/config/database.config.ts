import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { retry } from 'rxjs';

const logger = new Logger('DatabaseConfig');

export const getDatabaseConfig = (configService: ConfigService) => {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseAnonKey = configService.get<string>('SUPABASE_ANON_KEY');
  const supabaseServiceKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
  const maxRetries = configService.get<number>('DB_MAX_RETRIES', 3);
  const retryDelay = configService.get<number>('DB_RETRY_DELAY', 1000);

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    logger.error('Missing Supabase configuration');
    throw new Error('Supabase configuration is required');
  }

  const createSupabaseClient = (key: string, isServiceRole = false) => {
    try {
      return createClient(supabaseUrl, key, {
        db: {
          schema: 'public',
        },
        auth: {
          persistSession: false,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'x-application-name': 'saas-backend',
            'x-client-type': isServiceRole ? 'service-role' : 'anon',
          },
        },
      });
    } catch (error) {
      logger.error(`Failed to create Supabase ${isServiceRole ? 'service' : 'anon'} client`, error);
      throw error;
    }
  };

  const anonClient = createSupabaseClient(supabaseAnonKey);
  const serviceClient = createSupabaseClient(supabaseServiceKey, true);

  // Test connection
  const testConnection = async (client: any) => {
    try {
      await client.from('health_check').select('*').limit(1);
      logger.log('Database connection established successfully');
    } catch (error) {
      logger.error('Database connection test failed', error);
      throw error;
    }
  };

  // Retry connection with exponential backoff
  const retryConnection = async (client: any, attempt = 1): Promise<void> => {
    try {
      await testConnection(client);
    } catch (error) {
      if (attempt >= maxRetries) {
        logger.error(`Failed to connect to database after ${maxRetries} attempts`);
        throw error;
      }
      const delay = retryDelay * Math.pow(2, attempt - 1);
      logger.warn(`Retrying database connection in ${delay}ms (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryConnection(client, attempt + 1);
    }
  };

  // Initialize connections
  Promise.all([
    retryConnection(anonClient),
    retryConnection(serviceClient)
  ]).catch(error => {
    logger.error('Fatal: Could not establish database connection', error);
    process.exit(1);
  });

  return {
    supabase: {
      anon: anonClient,
      service: serviceClient,
    },
    pool: {
      min: configService.get<number>('DB_POOL_MIN', 2),
      max: configService.get<number>('DB_POOL_MAX', 10),
      idleTimeoutMillis: configService.get<number>('DB_POOL_IDLE_TIMEOUT', 30000),
      connectionTimeoutMillis: configService.get<number>('DB_POOL_CONNECTION_TIMEOUT', 2000),
    },
    retry: {
      max: maxRetries,
      timeout: retryDelay,
    },
  };
};

export const DATABASE_CONFIG = 'DATABASE_CONFIG'; 