import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

interface CacheItem<T> {
  value: T;
  expiry: number;
}

@Injectable()
export class AiCacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTtl: number; // in milliseconds

  constructor(private configService: ConfigService) {
    // Default TTL is 24 hours, can be configured in env
    this.defaultTtl = parseInt(this.configService.get<string>('AI_CACHE_TTL') || '86400000');
    
    // Setup periodic cleanup
    setInterval(() => this.cleanupExpiredItems(), 3600000); // Clean every hour
  }

  /**
   * Generate a cache key from input parameters
   */
  generateKey(endpoint: string, params: any): string {
    const paramString = JSON.stringify(params);
    // Create a hash of the parameters to use as cache key
    return `${endpoint}:${createHash('md5').update(paramString).digest('hex')}`;
  }

  /**
   * Get an item from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Set an item in cache
   */
  set<T>(key: string, value: T, ttl: number = this.defaultTtl): void {
    // Skip caching null or undefined values
    if (value === null || value === undefined) {
      return;
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
    
    // Log cache size periodically
    if (this.cache.size % 10 === 0) {
      console.log(`AI Cache size: ${this.cache.size} items`);
    }
  }

  /**
   * Remove item from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get or set cache item with function to create value if not in cache
   */
  async getOrSet<T>(key: string, createFn: () => Promise<T>, ttl?: number): Promise<T> {
    // Try to get from cache first
    const cachedItem = this.get<T>(key);
    if (cachedItem !== null) {
      return cachedItem;
    }
    
    // Not in cache, call the function to create the value
    const value = await createFn();
    
    // Store in cache if the value is valid
    if (value !== null && value !== undefined) {
      this.set(key, value, ttl);
    }
    
    return value;
  }

  /**
   * Clean up expired items from cache
   */
  private cleanupExpiredItems(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Cleaned up ${expiredCount} expired AI cache items. New size: ${this.cache.size}`);
    }
  }
} 