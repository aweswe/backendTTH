import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeadsModule } from './leads/leads.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { CustomerPortalModule } from './customer-portal/customer-portal.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PdfModule } from './pdf/pdf.module';
import { PdfThemeModule } from './pdf-theme/pdf-theme.module';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { AiModule } from './ai/ai.module';
import { LoggerModule } from './logger/logger.module';
import { OfflineSyncModule } from './offline-sync/offline-sync.module';
import { SupabaseModule } from './supabase/supabase.module';
import { MockPrismaService } from './auth/auth.service';
import * as Joi from 'joi';

@Module({
  imports: [
    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        // Database
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_ANON_KEY: Joi.string().required(),
        DB_MAX_RETRIES: Joi.number().default(3),
        DB_RETRY_DELAY: Joi.number().default(1000),
        DB_POOL_MIN: Joi.number().default(2),
        DB_POOL_MAX: Joi.number().default(10),
        DB_POOL_IDLE_TIMEOUT: Joi.number().default(30000),
        DB_POOL_CONNECTION_TIMEOUT: Joi.number().default(2000),

        // Redis
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow(''),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('24h'),

        // AI Services
        DEEPSEEK_API_KEY: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),

        // Storage
        S3_ACCESS_KEY: Joi.string().required(),
        S3_SECRET_KEY: Joi.string().required(),
        S3_BUCKET_NAME: Joi.string().required(),
        S3_REGION: Joi.string().required(),

        // Email
        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),

        // WhatsApp
        WHATSAPP_API_KEY: Joi.string().required(),
        WHATSAPP_API_URL: Joi.string().required(),

        // Application
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        FRONTEND_URL: Joi.string().required(),
        CORS_ORIGIN: Joi.string().required(),

        // Rate Limiting
        RATE_LIMIT_WINDOW: Joi.number().default(15),
        RATE_LIMIT_MAX: Joi.number().default(100),
      }),
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
    
    // Rate Limiting
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 60000,
      limit: 100,
    }]),
    
    // Event Handling
    EventEmitterModule.forRoot(),
    
    // Scheduling
    ScheduleModule.forRoot(),
    
    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000, // 1 hour
    }),
    
    // Queue Processing
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    
    // Metrics
    PrometheusModule.register(),
    
    // Core Modules
    DatabaseModule,
    LoggerModule,
    HealthModule,
    MetricsModule,
    
    // Authentication & Users
    AuthModule,
    UsersModule,
    
    // Business Logic Modules
    LeadsModule,
    ItineraryModule,
    CustomerPortalModule,
    AnalyticsModule,
    
    // Supporting Modules
    NotificationsModule,
    PdfModule,
    PdfThemeModule,
    AiModule,
    OfflineSyncModule,
    SupabaseModule,
  ],
  providers: [
    {
      provide: MockPrismaService,
      useClass: MockPrismaService,
    },
  ],
})
export class AppModule {}
