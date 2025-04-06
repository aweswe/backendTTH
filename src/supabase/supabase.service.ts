import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async executeQuery(tableName: string, query: any) {
    return this.supabase.from(tableName).select(query);
  }

  async insert(tableName: string, data: any) {
    return this.supabase.from(tableName).insert(data);
  }

  async update(tableName: string, data: any, match: any) {
    return this.supabase.from(tableName).update(data).match(match);
  }

  async delete(tableName: string, match: any) {
    return this.supabase.from(tableName).delete().match(match);
  }
} 