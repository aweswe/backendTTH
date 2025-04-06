import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AiErrorSupabaseRepository } from './ai-error-supabase.repository';

export enum AIErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  MODEL_NOT_FOUND = 'MODEL_NOT_FOUND',
  INVALID_REQUEST = 'INVALID_REQUEST',
  API_ERROR = 'API_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AIErrorRecord {
  id?: string;
  timestamp: Date;
  errorType: AIErrorType;
  endpoint: string;
  modelName: string;
  errorMessage: string;
  stackTrace?: string;
  inputPreview?: string;
  status?: number;
}

@Injectable()
export class AiErrorTrackerService {
  private errorCounts: Record<AIErrorType, number> = {
    [AIErrorType.RATE_LIMIT]: 0,
    [AIErrorType.QUOTA_EXCEEDED]: 0,
    [AIErrorType.MODEL_NOT_FOUND]: 0,
    [AIErrorType.INVALID_REQUEST]: 0,
    [AIErrorType.API_ERROR]: 0,
    [AIErrorType.PARSING_ERROR]: 0,
    [AIErrorType.UNKNOWN]: 0,
  };

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    @Optional() private aiErrorRepo?: AiErrorSupabaseRepository,
  ) {}

  async trackError(error: any, endpoint: string, modelName: string, inputPreview?: string): Promise<void> {
    // Determine error type
    let errorType = AIErrorType.UNKNOWN;
    
    if (error?.status === 429) {
      if (error?.error?.code === 'insufficient_quota') {
        errorType = AIErrorType.QUOTA_EXCEEDED;
      } else {
        errorType = AIErrorType.RATE_LIMIT;
      }
    } else if (error?.error?.code === 'model_not_found') {
      errorType = AIErrorType.MODEL_NOT_FOUND;
    } else if (error?.error?.type === 'invalid_request_error') {
      errorType = AIErrorType.INVALID_REQUEST;
    } else if (error instanceof SyntaxError) {
      errorType = AIErrorType.PARSING_ERROR;
    } else if (error) {
      errorType = AIErrorType.API_ERROR;
    }

    // Increment error count
    this.errorCounts[errorType]++;
    
    // Log detailed error
    console.error(`AI Error [${errorType}] for ${endpoint} using ${modelName}: ${error?.message || 'Unknown error'}`);
    
    // Store in database for analytics
    try {
      // Try Supabase repository first if available
      if (this.aiErrorRepo) {
        await this.aiErrorRepo.createError({
          errorType,
          endpoint,
          modelName,
          errorMessage: error?.message || 'Unknown error',
          stackTrace: error?.stack,
          inputPreview: inputPreview?.substring(0, 200),
          status: error?.status || 500,
        });
      } else {
        // Fall back to Prisma if no Supabase repository is available
        await this.prisma.aiError.create({
          data: {
            errorType,
            endpoint,
            modelName,
            errorMessage: error?.message || 'Unknown error',
            stackTrace: error?.stack,
            inputPreview: inputPreview?.substring(0, 200),
            status: error?.status || 500,
          },
        });
      }
    } catch (dbError) {
      // Enhanced error handling for database connectivity issues
      console.error(`Failed to store AI error record: ${dbError.message}`);
      
      if (dbError.code === 'P1001' || dbError.message.includes("Can't reach database server")) {
        console.warn('Database connectivity issue detected - error tracking will continue in memory only');
        // In a production environment, you might want to implement a fallback storage mechanism
        // such as writing to a local file or queueing the errors for later processing
      }
    }
    
    // Check if we should alert based on error rates
    this.checkAlertThresholds(errorType);
  }
  
  private checkAlertThresholds(errorType: AIErrorType): void {
    const thresholds: Record<AIErrorType, number> = {
      [AIErrorType.RATE_LIMIT]: 10,
      [AIErrorType.QUOTA_EXCEEDED]: 5,
      [AIErrorType.MODEL_NOT_FOUND]: 3,
      [AIErrorType.INVALID_REQUEST]: 5,
      [AIErrorType.API_ERROR]: 10,
      [AIErrorType.PARSING_ERROR]: 5,
      [AIErrorType.UNKNOWN]: 20,
    };
    
    if (this.errorCounts[errorType] >= thresholds[errorType]) {
      // Alert mechanism (this could be integrated with your notification system)
      console.warn(`ALERT: AI ${errorType} errors threshold exceeded (${this.errorCounts[errorType]}/${thresholds[errorType]})`);
      
      // Reset counter after alert
      this.errorCounts[errorType] = 0;
    }
  }
  
  async getErrorStats(days: number = 7): Promise<Record<AIErrorType, number>> {
    const stats: Record<AIErrorType, number> = {
      [AIErrorType.RATE_LIMIT]: 0,
      [AIErrorType.QUOTA_EXCEEDED]: 0,
      [AIErrorType.MODEL_NOT_FOUND]: 0, 
      [AIErrorType.INVALID_REQUEST]: 0,
      [AIErrorType.API_ERROR]: 0,
      [AIErrorType.PARSING_ERROR]: 0,
      [AIErrorType.UNKNOWN]: 0,
    };
    
    try {
      // Try Supabase repository first if available
      if (this.aiErrorRepo) {
        const repoStats = await this.aiErrorRepo.getErrorStats(days);
        if (repoStats) {
          return repoStats;
        }
      }
      
      // Fall back to Prisma if Supabase failed or is not available
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const errors = await this.prisma.aiError.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
        },
      });
      
      // Count errors by type
      errors.forEach((error: any) => {
        stats[error.errorType as AIErrorType]++;
      });
    } catch (dbError) {
      console.error(`Failed to retrieve AI error stats: ${dbError.message}`);
      // Return current in-memory counts if database is unavailable
      return { ...this.errorCounts };
    }
    
    return stats;
  }
} 