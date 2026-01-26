import type { GameType, GameContent } from '../models/GameSession.model.js';

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * Cache key interface for game content
 */
interface GameContentCacheKey {
  gameType: GameType;
  difficulty: string;
  language: string;
  targetLanguage: string;
  topic?: string;
}

/**
 * Cache statistics interface
 */
interface CacheStats {
  memoryEntries: number;
  localStorageEntries: number;
  hitRate: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  averageGenerationTime: number;
}

/**
 * Content Cache Service
 * Implements multi-level caching with memory and localStorage
 */
export class ContentCacheService {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private readonly maxMemoryEntries: number;
  private readonly defaultTTL: number;
  private readonly localStoragePrefix = 'linguaspark_content_';
  
  // Statistics tracking
  private stats = {
    totalRequests: 0,
    totalHits: 0,
    totalMisses: 0,
    generationTimes: [] as number[]
  };

  constructor(maxMemoryEntries: number = 100, defaultTTL: number = 3600000) { // 1 hour default TTL
    this.maxMemoryEntries = maxMemoryEntries;
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries periodically
    setInterval(() => this.cleanupExpiredEntries(), 300000); // Every 5 minutes
  }

  /**
   * Generate cache key from game content options
   */
  private generateCacheKey(key: GameContentCacheKey): string {
    const parts = [
      key.gameType,
      key.difficulty,
      key.language,
      key.targetLanguage,
      key.topic || 'general'
    ];
    return parts.join('|').toLowerCase();
  }

  /**
   * Get content from cache (checks memory first, then localStorage)
   */
  async get<T>(key: GameContentCacheKey): Promise<T | null> {
    this.stats.totalRequests++;
    const cacheKey = this.generateCacheKey(key);
    
    try {
      // Check memory cache first
      const memoryEntry = this.memoryCache.get(cacheKey);
      if (memoryEntry && this.isEntryValid(memoryEntry)) {
        memoryEntry.accessCount++;
        memoryEntry.lastAccessed = Date.now();
        this.stats.totalHits++;
        console.log(`Memory cache hit for: ${cacheKey}`);
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
        
        this.stats.totalHits++;
        console.log(`localStorage cache hit for: ${cacheKey}`);
        return localStorageEntry.data;
      }

      this.stats.totalMisses++;
      console.log(`Cache miss for: ${cacheKey}`);
      return null;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      this.stats.totalMisses++;
      return null;
    }
  }

  /**
   * Store content in cache (both memory and localStorage)
   */
  async set<T>(key: GameContentCacheKey, data: T, ttl?: number): Promise<void> {
    const cacheKey = this.generateCacheKey(key);
    const actualTTL = ttl || this.defaultTTL;
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      ttl: actualTTL,
      accessCount: 1,
      lastAccessed: now
    };

    try {
      // Store in memory cache
      this.memoryCache.set(cacheKey, entry);
      
      // Enforce memory cache size limit
      if (this.memoryCache.size > this.maxMemoryEntries) {
        this.evictLeastRecentlyUsed();
      }

      // Store in localStorage
      this.setInLocalStorage(cacheKey, entry);
      
      console.log(`Cached content for: ${cacheKey} (TTL: ${actualTTL}ms)`);
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  }

  /**
   * Get content with generation fallback
   */
  async getOrGenerate<T>(
    key: GameContentCacheKey,
    generator: () => Promise<T>,
    ttl?: number
  ): Promise<{ data: T; fromCache: boolean; generationTime?: number }> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached) {
      return { data: cached, fromCache: true };
    }

    // Generate new content
    const startTime = Date.now();
    try {
      const generated = await generator();
      const generationTime = Date.now() - startTime;
      
      // Track generation time for statistics
      this.stats.generationTimes.push(generationTime);
      if (this.stats.generationTimes.length > 100) {
        this.stats.generationTimes.shift(); // Keep only last 100 entries
      }

      // Cache the generated content
      await this.set(key, generated, ttl);
      
      console.log(`Generated and cached content for: ${this.generateCacheKey(key)} (${generationTime}ms)`);
      return { data: generated, fromCache: false, generationTime };
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidate(pattern: Partial<GameContentCacheKey>): Promise<number> {
    let invalidatedCount = 0;

    try {
      // Create pattern matcher
      const matchesPattern = (key: string): boolean => {
        const parts = key.split('|');
        if (parts.length < 4) return false;

        const [gameType, difficulty, language, targetLanguage, topic] = parts;
        
        return (
          (!pattern.gameType || gameType === pattern.gameType) &&
          (!pattern.difficulty || difficulty === pattern.difficulty) &&
          (!pattern.language || language === pattern.language) &&
          (!pattern.targetLanguage || targetLanguage === pattern.targetLanguage) &&
          (!pattern.topic || topic === (pattern.topic || 'general'))
        );
      };

      // Invalidate memory cache entries
      for (const [key] of this.memoryCache) {
        if (matchesPattern(key)) {
          this.memoryCache.delete(key);
          invalidatedCount++;
        }
      }

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

      console.log(`Invalidated ${invalidatedCount} cache entries matching pattern:`, pattern);
      return invalidatedCount;
    } catch (error) {
      console.error('Cache invalidation error:', error);
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
        generationTimes: []
      };

      console.log('Cache cleared completely');
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.totalHits / this.stats.totalRequests) * 100 
      : 0;

    const averageGenerationTime = this.stats.generationTimes.length > 0
      ? this.stats.generationTimes.reduce((a, b) => a + b, 0) / this.stats.generationTimes.length
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
      hitRate: Math.round(hitRate * 100) / 100,
      totalRequests: this.stats.totalRequests,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
      averageGenerationTime: Math.round(averageGenerationTime)
    };
  }

  /**
   * Check if cache entry is still valid
   */
  private isEntryValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Get entry from localStorage
   */
  private getFromLocalStorage<T>(key: string): CacheEntry<T> | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      
      const stored = localStorage.getItem(this.localStoragePrefix + key);
      if (!stored) return null;

      const entry = JSON.parse(stored) as CacheEntry<T>;
      
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
  private setInLocalStorage<T>(key: string, entry: CacheEntry<T>): void {
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
  private evictLeastRecentlyUsed(): void {
    if (this.memoryCache.size <= this.maxMemoryEntries) return;

    const entries = Array.from(this.memoryCache.entries());
    
    // Sort by last accessed time (oldest first)
    entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    // Remove oldest 20% of entries
    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete(entries[i][0]);
    }

    console.log(`Evicted ${toRemove} entries from memory cache`);
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
      console.log(`Cleaned up ${removedCount} expired cache entries`);
    }
  }

  /**
   * Clean up localStorage when quota is exceeded
   */
  private cleanupLocalStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;

      const entries: Array<{ key: string; timestamp: number }> = [];
      
      // Collect all cache entries with timestamps
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.localStoragePrefix)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const entry = JSON.parse(stored);
              entries.push({ key, timestamp: entry.timestamp });
            } catch (error) {
              // Invalid entry, mark for removal
              entries.push({ key, timestamp: 0 });
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
}

// Export singleton instance
export const contentCache = new ContentCacheService();

export default ContentCacheService;