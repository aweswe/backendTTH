import { Module } from '@nestjs/common';
import { BullModule as NestBullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestBullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
          password: configService.get('REDIS_PASSWORD'),
        },
        prefix: configService.get('BULL_PREFIX') || 'tth',
      }),
    }),
    NestBullModule.registerQueue(
      { name: 'analytics' },
      { name: 'pdf' },
      { name: 'email' },
      { name: 'notification' },
    ),
  ],
  exports: [NestBullModule],
})
export class BullModule {} 