import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.isConnected = false;
      this.logger.error(`Failed to connect to the database: ${error.message}`);
      this.logger.warn('Application will continue running but database operations will fail');
      
      // Log more detailed error information
      if (error.code === 'P1001') {
        this.logger.error('Cannot reach database server. Please check your connection string and network connectivity.');
      } else if (error.code === 'P1003') {
        this.logger.error('Database does not exist or is unavailable.');
      }
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.logger.log('Disconnected from the database');
    }
  }

  /**
   * Check if the database connection is active
   */
  isDatabaseConnected(): boolean {
    return this.isConnected;
  }

  // Helper method to clean the database (for testing)
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'test') {
      const models = Object.keys(this).filter(
        (key) => key[0] !== '_' && key[0] !== '$'
      );
      
      return Promise.all(
        models.map((modelKey) => {
          const model = (this as any)[modelKey];
          if (model && typeof model === 'object' && 'deleteMany' in model) {
            return (model as any).deleteMany();
          }
          return Promise.resolve();
        })
      );
    }
  }
} 