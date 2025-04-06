import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiHealthIndicator extends HealthIndicator {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async checkOpenAI(key: string): Promise<HealthIndicatorResult> {
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      
      const isHealthy = response.status === 200;
      return this.getStatus(key, isHealthy);
    } catch (error) {
      throw new HealthCheckError(
        'OpenAI check failed',
        this.getStatus(key, false, { error: error.message }),
      );
    }
  }

  async checkDeepSeek(key: string): Promise<HealthIndicatorResult> {
    try {
      const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
      // Since DeepSeek doesn't have a dedicated health endpoint,
      // we'll just verify we have an API key
      const isHealthy = !!apiKey;
      return this.getStatus(key, isHealthy);
    } catch (error) {
      throw new HealthCheckError(
        'DeepSeek check failed',
        this.getStatus(key, false, { error: error.message }),
      );
    }
  }
} 