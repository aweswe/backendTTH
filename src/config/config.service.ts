import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app() {
    return {
      port: this.configService.get<number>('config.app.port'),
      env: this.configService.get<string>('config.app.env'),
      prefix: this.configService.get<string>('config.app.prefix'),
      corsOrigin: this.configService.get<string>('config.app.corsOrigin'),
    };
  }

  get database() {
    return {
      url: this.configService.get<string>('config.database.url'),
    };
  }

  get supabase() {
    return {
      url: this.configService.get<string>('config.supabase.url'),
      key: this.configService.get<string>('config.supabase.key'),
    };
  }

  get jwt() {
    return {
      secret: this.configService.get<string>('config.jwt.secret'),
      expiration: this.configService.get<string>('config.jwt.expiration'),
    };
  }

  get ai() {
    return {
      deepseek: {
        apiKey: this.configService.get<string>('config.ai.deepseek.apiKey'),
      },
      openai: {
        apiKey: this.configService.get<string>('config.ai.openai.apiKey'),
      },
    };
  }

  get email() {
    return {
      sendgrid: {
        apiKey: this.configService.get<string>('config.email.sendgrid.apiKey'),
      },
    };
  }

  get whatsapp() {
    return {
      apiKey: this.configService.get<string>('config.whatsapp.apiKey'),
      phoneNumber: this.configService.get<string>('config.whatsapp.phoneNumber'),
    };
  }

  get redis() {
    return {
      host: this.configService.get<string>('config.redis.host'),
      port: this.configService.get<number>('config.redis.port'),
      password: this.configService.get<string>('config.redis.password'),
    };
  }

  get bull() {
    return {
      prefix: this.configService.get<string>('config.bull.prefix'),
      redisUrl: this.configService.get<string>('config.bull.redisUrl'),
    };
  }
} 