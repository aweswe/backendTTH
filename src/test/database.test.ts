import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from '../config/database.config';
import { Logger } from '@nestjs/common';

describe('Database Connection Test', () => {
  let configService: ConfigService;
  let logger: Logger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    logger = new Logger('DatabaseTest');
  });

  it('should establish connection with both anon and service role clients', async () => {
    try {
      const config = getDatabaseConfig(configService);
      
      // Test anon client
      const anonResult = await config.supabase.anon
        .from('health_check')
        .select('*')
        .limit(1);
      
      logger.log('Anon client connection successful');
      expect(anonResult).toBeDefined();
      expect(anonResult.error).toBeNull();

      // Test service client
      const serviceResult = await config.supabase.service
        .from('health_check')
        .select('*')
        .limit(1);
      
      logger.log('Service client connection successful');
      expect(serviceResult).toBeDefined();
      expect(serviceResult.error).toBeNull();

    } catch (error) {
      logger.error('Database connection test failed', error);
      throw error;
    }
  });

  it('should handle connection pooling settings', () => {
    const config = getDatabaseConfig(configService);
    
    expect(config.pool).toBeDefined();
    expect(config.pool.min).toBeGreaterThanOrEqual(2);
    expect(config.pool.max).toBeGreaterThanOrEqual(config.pool.min);
    expect(config.pool.idleTimeoutMillis).toBeGreaterThan(0);
    expect(config.pool.connectionTimeoutMillis).toBeGreaterThan(0);
  });

  it('should have retry configuration', () => {
    const config = getDatabaseConfig(configService);
    
    expect(config.retry).toBeDefined();
    expect(config.retry.max).toBeGreaterThan(0);
    expect(config.retry.timeout).toBeGreaterThan(0);
  });
}); 