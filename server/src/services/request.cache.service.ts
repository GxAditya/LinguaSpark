import type { TextGenerationOptions, ImageGenerationOptions, TextResponse, ImageResponse } from './pollinations.api.service.js';

/**
 * Request cache entry interface
 */
interface RequestCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  requestHash: string;
  size: number;
}

/**
 * Cache key interface for API requests
 */
interface RequestCacheKey {
  type: 'text' | 'image';
  prompt: string;
  options: TextGenerationOptions | ImageGenerationOptions;
}

/**
 * Cache statistics interface
 */
interface RequestCacheStats {
  memoryEntries: number;
  localStorageEntries: number;
  totalSize: number;
  hitRate: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  averageResponseTime: number;
  cacheEfficiency: number;
}

/**
 * Request Cache Service
 * Implements multi-level caching specifically for API requests with memory and localStorage
 */
export class RequestCacheService {
  private memoryCache = new Map<string, RequestCacheEntry<any>>();
  private readonly maxMemoryEntries: number;
  private readonly maxMemorySize: number; // in bytes
  private readonly defaultTTL: number;
  private readonly localStoragePrefix = 'linguaspark_request_';
  
  // Statistics tracking
  private stats = {
    totalRequests: 0,
    totalHits: 0,
    totalMisses: 0,
    responseTimes: [] as number[],
    totalSize: 0
  };

  constructor(
    maxMemoryEntries: number = 200, 
    maxMemorySize: number = 50 * 1024 * 1024, // 50MB
    defaultTTL: number = 1800000 // 30 minutes
  ) {
    this.maxMemoryEntries = maxMemoryEntries;
    this.maxMemorySize = maxMemorySize;
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries periodically
    setInterval(() => this.cleanupExpiredEntries(), 300000); // Every 5 minutes
    
    // Monitor memory usage
    setInterval(() => this.enforceMemoryLimits(), 60000); // Every minute
  }

  /**
   * Generate cache key from request parameters
   */
  private generateCacheKey(key: RequestCacheKey): string {
    const optionsHash = this.hashObject(key.options);
    const promptHash = this.hashString(key.prompt);
    return `${key.type}:${promptHash}:${optionsHash}`;
  }

  /**
   * Get response from cache (checks memory first, then localStorage)
   */
  async get<T>(key: RequestCacheKey): Promise<T | null> {
    this.stats.totalRequests++;
    const cacheKey = this.generateCacheKey(key);
    
    try {
      // Check memory cache first
      const memoryEntry = this.memoryCache.get(cacheKey);
      if (memoryEntry && this.isEntryValid(memoryEntry)) {
        memoryEntry.accessCount++;
        memoryEntry.lastAccessed = Date.now();
        this.stats.totalHits++;
        console.log(`Memory cache hit for: ${key.type} request`);
        return memoryEntry.data;
      }

      // Check localStorage cache
      const localStorageEntry = this.getFromLocalStorage<T>(cacheKey);
      if (localStorageEntry) {
        // Restore to memory cache for faster future access
        this.memoryCache.set(cacheKey, {
          ...localStorageEntry,
          accessCount: localStorageEntry.accessCount + 1,
          lastAccessed: Date.now()
        });
        
        this.updateMemoryStats();
        this.stats.totalHits++;
        console.log(`localStorage cache hit for: ${key.type} request`);
        return localStorageEntry.data;
      }

      this.stats.totalMisses++;
      console.log(`Cache miss for: ${key.type} request`);
      return null;
    } catch (error) {
      console.error('Request cache retrieval error:', error);
      this.stats.totalMisses++;
      return null;
    }
  }

  /**
   * Store response in cache (both memory and localStorage)
   */
  async set<T>(key: RequestCacheKey, data: T, ttl?: number, responseTime?: number): Promise<void> {
    const cacheKey = this.generateCacheKey(key);
    const actualTTL = ttl || this.defaultTTL;
    const now = Date.now();
    const dataSize = this.calculateSize(data);
    
    const entry: RequestCacheEntry<T> = {
      data,
      timestamp: now,
      ttl: actualTTL,
      accessCount: 1,
      lastAccessed: now,
      requestHash: this.hashString(JSON.stringify(key)),
      size: dataSize
    };

    try {
      // Store in memory cache
      this.memoryCache.set(cacheKey, entry);
      this.updateMemoryStats();
      
      // Track response time for statistics
      if (responseTime !== undefined) {
        this.stats.responseTimes.push(responseTime);
        if (this.stats.responseTimes.length > 100) {
          this.stats.responseTimes.shift(); // Keep only last 100 entries
        }
      }

      // Enforce memory limits
      this.enforceMemoryLimits();

      // Store in localStorage (with size check)
      if (dataSize < 1024 * 1024) { // Only cache items smaller than 1MB in localStorage
        this.setInLocalStorage(cacheKey, entry);
      }
      
      console.log(`Cached ${key.type} request (${dataSize} bytes, TTL: ${actualTTL}ms)`);
    } catch (error) {
      console.error('Request cache storage error:', error);
    }
  }

  /**
   * Get response with generation fallback and automatic caching
   */
  async getOrGenerate<T>(
    key: RequestCacheKey,
    generator: () => Promise<T>,
    ttl?: number
  ): Promise<{ data: T; fromCache: boolean; responseTime?: number }> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached) {
      return { data: cached, fromCache: true };
    }

    // Generate new response
    const startTime = Date.now();
    try {
      const generated = await generator();
      const responseTime = Date.now() - startTime;

      // Cache the generated response
      await this.set(key, generated, ttl, responseTime);
      
      console.log(`Generated and cached ${key.type} request (${responseTime}ms)`);
      return { data: generated, fromCache: false, responseTime };
    } catch (error) {
      console.error(`${key.type} request generation failed:`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidate(pattern: Partial<RequestCacheKey>): Promise<number> {
    let invalidatedCount = 0;

    try {
      // Create pattern matcher
      const matchesPattern = (key: string): boolean => {
        const parts = key.split(':');
        if (parts.length < 2) return false;

        const [type] = parts;
        
        return (
          (!pattern.type || type === pattern.type) &&
          (!pattern.prompt || key.includes(this.hashString(pattern.prompt)))
        );
      };

      // Invalidate memory cache entries
      for (const [key] of this.memoryCache) {
        if (matchesPattern(key)) {
          this.memoryCache.delete(key);
          invalidatedCount++;
        }
      }

      this.updateMemoryStats();

      // Invalidate localStorage entries
      if (typeof localStorage !== 'undefined') {
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey?.startsWith(this.localStoragePrefix)) {
            const cacheKey = storageKey.substring(this.localStoragePrefix.length);
            if (matchesPattern(cacheKey)) {
              keysToRemove.push(storageKey);
            }
          }
        }

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          invalidatedCount++;
        });
      }

      console.log(`Invalidated ${invalidatedCount} request cache entries matching pattern:`, pattern);
      return invalidatedCount;
    } catch (error) {
      console.error('Request cache invalidation error:', error);
      return 0;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      // Clear memory cache
      this.memoryCache.clear();
      this.updateMemoryStats();

      // Clear localStorage entries
      if (typeof localStorage !== 'undefined') {
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.localStoragePrefix)) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
      }

      // Reset statistics
      this.stats = {
        totalRequests: 0,
        totalHits: 0,
        totalMisses: 0,
        responseTimes: [],
        totalSize: 0
      };

      console.log('Request cache cleared completely');
    } catch (error) {
      console.error('Request cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): RequestCacheStats {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.totalHits / this.stats.totalRequests) * 100 
      : 0;

    const averageResponseTime = this.stats.responseTimes.length > 0
      ? this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length
      : 0;

    const cacheEfficiency = this.stats.totalRequests > 0
      ? ((this.stats.totalHits * averageResponseTime) / this.stats.totalRequests) / 1000 // seconds saved
      : 0;

    let localStorageEntries = 0;
    try {
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(this.localStoragePrefix)) {
            localStorageEntries++;
          }
        }
      }
    } catch (error) {
      console.warn('Could not count localStorage entries:', error);
    }

    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries,
      totalSize: this.stats.totalSize,
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests: this.stats.totalRequests,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
      averageResponseTime: Math.round(averageResponseTime),
      cacheEfficiency: Math.round(cacheEfficiency * 100) / 100
    };
  }

  /**
   * Preload cache with common requests
   */
  async preload(requests: Array<{ key: RequestCacheKey; generator: () => Promise<any> }>): Promise<void> {
    console.log(`Preloading ${requests.length} cache entries...`);
    
    const preloadPromises = requests.map(async ({ key, generator }) => {
      try {
        const cached = await this.get(key);
        if (!cached) {
          await this.getOrGenerate(key, generator);
        }
      } catch (error) {
        console.warn(`Preload failed for ${key.type} request:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('Cache preloading completed');
  }

  /**
   * Check if cache entry is still valid
   */
  private isEntryValid(entry: RequestCacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Calculate approximate size of data in bytes
   */
  private calculateSize(data: any): number {
    try {
      const jsonString = JSON.stringify(data);
      return Buffer.byteLength(jsonString, 'utf8');
    } catch (error) {
      // Fallback estimation
      return JSON.stringify(data).length * 2; // Rough estimate for UTF-16
    }
  }

  /**
   * Update memory statistics
   */
  private updateMemoryStats(): void {
    this.stats.totalSize = Array.from(this.memoryCache.values())
      .reduce((total, entry) => total + entry.size, 0);
  }

  /**
   * Enforce memory limits by evicting entries
   */
  private enforceMemoryLimits(): void {
    // Check entry count limit
    if (this.memoryCache.size > this.maxMemoryEntries) {
      this.evictLeastRecentlyUsed(this.memoryCache.size - this.maxMemoryEntries);
    }

    // Check memory size limit
    if (this.stats.totalSize > this.maxMemorySize) {
      const targetSize = this.maxMemorySize * 0.8; // Reduce to 80% of limit
      this.evictBySize(targetSize);
    }
  }

  /**
   * Get entry from localStorage
   */
  private getFromLocalStorage<T>(key: string): RequestCacheEntry<T> | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      
      const stored = localStorage.getItem(this.localStoragePrefix + key);
      if (!stored) return null;

      const entry = JSON.parse(stored) as RequestCacheEntry<T>;
      
      if (!this.isEntryValid(entry)) {
        localStorage.removeItem(this.localStoragePrefix + key);
        return null;
      }

      return entry;
    } catch (error) {
      console.warn('localStorage retrieval error:', error);
      return null;
    }
  }

  /**
   * Store entry in localStorage
   */
  private setInLocalStorage<T>(key: string, entry: RequestCacheEntry<T>): void {
    try {
      if (typeof localStorage === 'undefined') return;
      
      localStorage.setItem(
        this.localStoragePrefix + key,
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn('localStorage storage error (quota exceeded?):', error);
      // Try to free up space by removing oldest entries
      this.cleanupLocalStorage();
    }
  }

  /**
   * Evict least recently used entries from memory cache
   */
  private evictLeastRecentlyUsed(count: number): void {
    if (count <= 0) return;

    const entries = Array.from(this.memoryCache.entries());
    
    // Sort by last accessed time (oldest first)
    entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    // Remove oldest entries
    for (let i = 0; i < Math.min(count, entries.length); i++) {
      this.memoryCache.delete(entries[i][0]);
    }

    this.updateMemoryStats();
    console.log(`Evicted ${count} entries from memory cache (LRU)`);
  }

  /**
   * Evict entries by size to reach target size
   */
  private evictBySize(targetSize: number): void {
    const entries = Array.from(this.memoryCache.entries());
    
    // Sort by size (largest first) and access frequency (least accessed first)
    entries.sort(([, a], [, b]) => {
      const sizeRatio = b.size - a.size;
      if (Math.abs(sizeRatio) > 1000) return sizeRatio; // Prioritize size difference
      return a.accessCount - b.accessCount; // Then by access frequency
    });
    
    let currentSize = this.stats.totalSize;
    let removedCount = 0;
    
    for (const [key, entry] of entries) {
      if (currentSize <= targetSize) break;
      
      this.memoryCache.delete(key);
      currentSize -= entry.size;
      removedCount++;
    }

    this.updateMemoryStats();
    console.log(`Evicted ${removedCount} entries from memory cache (size optimization)`);
  }

  /**
   * Clean up expired entries from both caches
   */
  private cleanupExpiredEntries(): void {
    let removedCount = 0;

    // Clean memory cache
    for (const [key, entry] of this.memoryCache) {
      if (!this.isEntryValid(entry)) {
        this.memoryCache.delete(key);
        removedCount++;
      }
    }

    this.updateMemoryStats();

    // Clean localStorage cache
    try {
      if (typeof localStorage !== 'undefined') {
        const keysToRemove: string[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey?.startsWith(this.localStoragePrefix)) {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
              try {
                const entry = JSON.parse(stored);
                if (!this.isEntryValid(entry)) {
                  keysToRemove.push(storageKey);
                }
              } catch (error) {
                // Invalid JSON, remove it
                keysToRemove.push(storageKey);
              }
            }
          }
        }

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          removedCount++;
        });
      }
    } catch (error) {
      console.warn('localStorage cleanup error:', error);
    }

    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} expired request cache entries`);
    }
  }

  /**
   * Clean up localStorage when quota is exceeded
   */
  private cleanupLocalStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;

      const entries: Array<{ key: string; timestamp: number; size: number }> = [];
      
      // Collect all cache entries with timestamps and sizes
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.localStoragePrefix)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const entry = JSON.parse(stored);
              entries.push({ 
                key, 
                timestamp: entry.timestamp || 0,
                size: entry.size || stored.length
              });
            } catch (error) {
              // Invalid entry, mark for removal
              entries.push({ key, timestamp: 0, size: stored.length });
            }
          }
        }
      }

      // Sort by timestamp (oldest first) and remove oldest 50%
      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = Math.ceil(entries.length * 0.5);
      
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i].key);
      }

      console.log(`Cleaned up ${toRemove} localStorage entries to free space`);
    } catch (error) {
      console.error('localStorage cleanup failed:', error);
    }
  }

  /**
   * Hash string for cache keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Hash object for cache keys
   */
  private hashObject(obj: any): string {
    return this.hashString(JSON.stringify(obj, Object.keys(obj).sort()));
  }
}

// Export singleton instance
export const requestCache = new RequestCacheService();

export default RequestCacheService;