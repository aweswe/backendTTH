import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    abortOnError: false, // Don't abort on startup errors
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Security middleware
  app.use(helmet());

  // Compression with proper configuration
  app.use(
    compression({
      level: 6,
      threshold: 100 * 1024, // 100KB
    }),
  );

  // Rate limiting with proper configuration
  app.use(
    rateLimit({
      windowMs: configService.get<number>('RATE_LIMIT_WINDOW', 15) * 60 * 1000,
      max: configService.get<number>('RATE_LIMIT_MAX', 100),
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req: Request) => {
        // Skip rate limiting for health checks
        return req.url === '/health';
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Logger configuration
  app.useLogger(app.get(PinoLogger));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Travel Tech Hub API')
    .setDescription('Backend API for Travel Tech Hub application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log('Received shutdown signal');
    try {
      await app.close();
      console.log('Application closed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
