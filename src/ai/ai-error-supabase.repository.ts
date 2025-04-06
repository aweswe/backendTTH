import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AIErrorType } from './ai-error-tracker.service';

interface AiErrorRecord {
  id: string;
  timestamp: Date;
  errorType: string;
  endpoint: string;
  modelName: string;
  errorMessage: string;
  stackTrace?: string;
  inputPreview?: string;
  status?: number;
  resolved: boolean;
  createdAt: Date;
}

@Injectable()
export class AiErrorSupabaseRepository {
  private readonly TABLE_NAME = 'AiError';

  constructor(private supabaseService: SupabaseService) {}

  async createError(data: {
    errorType: AIErrorType;
    endpoint: string;
    modelName: string;
    errorMessage: string;
    stackTrace?: string;
    inputPreview?: string;
    status?: number;
  }) {
    try {
      const { data: result, error } = await this.supabaseService.insert(
        this.TABLE_NAME,
        {
          ...data,
          timestamp: new Date(),
          id: crypto.randomUUID(),
          resolved: false,
          createdAt: new Date(),
        }
      );

      if (error) {
        console.error('Failed to store AI error in Supabase:', error);
        return null;
      }

      return result;
    } catch (err) {
      console.error('Exception storing AI error in Supabase:', err);
      return null;
    }
  }

  async getErrorStats(days: number = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const startDateStr = startDate.toISOString();
      
      // First get the query builder
      const query = this.supabaseService.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .gte('timestamp', startDateStr);
      
      // Then execute it
      const { data, error } = await query;

      if (error) {
        console.error('Failed to get AI error stats from Supabase:', error);
        return null;
      }

      // Count errors by type
      const stats: Record<AIErrorType, number> = {
        [AIErrorType.RATE_LIMIT]: 0,
        [AIErrorType.QUOTA_EXCEEDED]: 0,
        [AIErrorType.MODEL_NOT_FOUND]: 0,
        [AIErrorType.INVALID_REQUEST]: 0,
        [AIErrorType.API_ERROR]: 0,
        [AIErrorType.PARSING_ERROR]: 0,
        [AIErrorType.UNKNOWN]: 0,
      };

      (data as AiErrorRecord[]).forEach((error: AiErrorRecord) => {
        const errorType = error.errorType as AIErrorType;
        stats[errorType] = (stats[errorType] || 0) + 1;
      });

      return stats;
    } catch (err) {
      console.error('Exception getting AI error stats from Supabase:', err);
      return null;
    }
  }
} 