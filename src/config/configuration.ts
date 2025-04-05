import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    env: process.env.NODE_ENV || 'development',
    prefix: process.env.API_PREFIX || '/api/v1',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '24h',
  },
  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
  email: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
  whatsapp: {
    apiKey: process.env.WHATSAPP_API_KEY,
    phoneNumber: process.env.WHATSAPP_PHONE_NUMBER,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
  },
  bull: {
    prefix: process.env.BULL_PREFIX || 'tth',
    redisUrl: process.env.BULL_REDIS_URL || 'redis://localhost:6379',
  },
})); 