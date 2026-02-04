import type { TextGenerationOptions, ImageGenerationOptions } from './pollinations.api.service.js';

/**
 * Request deduplication entry
 */
interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
  subscribers: Array<{
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }>;
}

/**
 * Batch request entry
 */
interface BatchRequest {
  prompt: string;
  options: ImageGenerationOptions;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

/**
 * Request optimization statistics
 */
interface OptimizationStats {
  deduplicatedRequests: number;
  batchedRequests: number;
  totalRequests: number;
  averageBatchSize: number;
  promptOptimizations: number;
  parameterOptimizations: number;
}

/**
 * Request Optimizer Service
 * Implements request deduplication, batching, and prompt optimization
 */
export class RequestOptimizerService {
  private pendingRequests = new Map<string, PendingRequest<any>>();
  private imageBatchQueue: BatchRequest[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly batchDelay = 2000; // 2 seconds
  private readonly maxBatchSize = 5;
  
  // Statistics tracking
  private stats: OptimizationStats = {
    deduplicatedRequests: 0,
    batchedRequests: 0,
    totalRequests: 0,
    averageBatchSize: 0,
    promptOptimizations: 0,
    parameterOptimizations: 0
  };

  constructor() {
    // Clean up expired pending requests periodically
    setInterval(() => this.cleanupExpiredRequests(), 30000); // Every 30 seconds
  }

  /**
   * Deduplicate identical requests
   */
  async deduplicateRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    ttl: number = 30000 // 30 seconds
  ): Promise<T> {
    this.stats.totalRequests++;

    // Check if there's already a pending request for this key
    const existing = this.pendingRequests.get(key);
    if (existing && Date.now() - existing.timestamp < ttl) {
      this.stats.deduplicatedRequests++;
      console.log(`Deduplicating request: ${key}`);
      
      // Return a promise that resolves when the existing request completes
      return new Promise<T>((resolve, reject) => {
        existing.subscribers.push({ resolve, reject });
      });
    }

    // Create new request
    const subscribers: Array<{ resolve: (value: T) => void; reject: (error: any) => void }> = [];
    
    const promise = requestFn()
      .then((result) => {
        // Resolve all subscribers
        subscribers.forEach(sub => sub.resolve(result));
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((error) => {
        // Reject all subscribers
        subscribers.forEach(sub => sub.reject(error));
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now(),
      subscribers
    });

    return promise;
  }

  /**
   * Batch image generation requests
   */
  async batchImageRequest(
    prompt: string,
    options: ImageGenerationOptions,
    generator: (prompts: string[], options: ImageGenerationOptions) => Promise<any[]>
  ): Promise<any> {
    this.stats.totalRequests++;

    return new Promise((resolve, reject) => {
      // Add to batch queue
      this.imageBatchQueue.push({
        prompt,
        options,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Start batch timer if not already running
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch(generator);
        }, this.batchDelay);
      }

      // Process immediately if batch is full
      if (this.imageBatchQueue.length >= this.maxBatchSize) {
        if (this.batchTimer) {
          clearTimeout(this.batchTimer);
          this.batchTimer = null;
        }
        this.processBatch(generator);
      }
    });
  }

  /**
   * Optimize prompt length and content
   */
  optimizePrompt(prompt: string, type: 'text' | 'image'): string {
    let optimized = prompt.trim();
    let wasOptimized = false;

    // Remove excessive whitespace
    const originalLength = optimized.length;
    optimized = optimized.replace(/\s+/g, ' ');
    
    if (type === 'text') {
      // Text prompt optimizations
      
      // Remove redundant phrases
      const redundantPhrases = [
        'please',
        'can you',
        'could you',
        'i want you to',
        'i need you to',
        'make sure to',
        'be sure to'
      ];
      
      redundantPhrases.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (regex.test(optimized)) {
          optimized = optimized.replace(regex, '').replace(/\s+/g, ' ').trim();
          wasOptimized = true;
        }
      });

      // Limit length for text generation (allow longer structured prompts)
      if (optimized.length > 2000) {
        optimized = optimized.substring(0, 1997) + '...';
        wasOptimized = true;
      }
      
    } else if (type === 'image') {
      // Image prompt optimizations
      
      // Add style keywords if missing
      const styleKeywords = ['icon', 'simple', 'clean', 'minimalist', 'flat design'];
      const hasStyleKeyword = styleKeywords.some(keyword => 
        optimized.toLowerCase().includes(keyword)
      );
      
      if (!hasStyleKeyword && optimized.length < 100) {
        optimized += ', simple icon style, clean background';
        wasOptimized = true;
      }

      // Remove verbose descriptions for better image generation
      const verbosePatterns = [
        /\b(very|extremely|really|quite|rather|pretty|fairly)\s+/gi,
        /\b(in the style of|similar to|like a|resembling)\s+[^,]+,?\s*/gi,
        /\b(high quality|high resolution|detailed|realistic)\s*/gi
      ];
      
      verbosePatterns.forEach(pattern => {
        if (pattern.test(optimized)) {
          optimized = optimized.replace(pattern, '').replace(/\s+/g, ' ').trim();
          wasOptimized = true;
        }
      });

      // Limit length for image generation (optimal range: 20-150 characters)
      if (optimized.length > 150) {
        optimized = optimized.substring(0, 147) + '...';
        wasOptimized = true;
      }
    }

    if (wasOptimized || optimized.length !== originalLength) {
      this.stats.promptOptimizations++;
      console.log(`Optimized ${type} prompt: ${originalLength} -> ${optimized.length} chars`);
    }

    return optimized;
  }

  /**
   * Optimize generation parameters
   */
  optimizeParameters(
    options: TextGenerationOptions | ImageGenerationOptions,
    type: 'text' | 'image'
  ): TextGenerationOptions | ImageGenerationOptions {
    let optimized = { ...options };
    let wasOptimized = false;

    if (type === 'text') {
      const textOptions = optimized as TextGenerationOptions;
      
      // Optimize temperature for different use cases
      if (textOptions.temperature === undefined) {
        textOptions.temperature = 0.7; // Good default
        wasOptimized = true;
      } else if (textOptions.temperature > 1.0) {
        textOptions.temperature = 1.0; // Cap at maximum useful value
        wasOptimized = true;
      }

      // Optimize max_tokens based on typical needs
      if (textOptions.max_tokens === undefined) {
        textOptions.max_tokens = 1000; // Reasonable default
        wasOptimized = true;
      } else if (textOptions.max_tokens > 4000) {
        textOptions.max_tokens = 4000; // Cap to prevent excessive costs
        wasOptimized = true;
      }

    } else if (type === 'image') {
      const imageOptions = optimized as ImageGenerationOptions;
      
      // Optimize image dimensions for common use cases
      if (!imageOptions.width && !imageOptions.height) {
        imageOptions.width = 256;
        imageOptions.height = 256;
        wasOptimized = true;
      }

      // Ensure dimensions are reasonable
      if (imageOptions.width && imageOptions.width > 1024) {
        imageOptions.width = 1024;
        wasOptimized = true;
      }
      if (imageOptions.height && imageOptions.height > 1024) {
        imageOptions.height = 1024;
        wasOptimized = true;
      }

      // Set enhance to false by default to save costs
      if (imageOptions.enhance === undefined) {
        imageOptions.enhance = false;
        wasOptimized = true;
      }
    }

    if (wasOptimized) {
      this.stats.parameterOptimizations++;
      console.log(`Optimized ${type} parameters`);
    }

    return optimized;
  }

  /**
   * Get optimization statistics
   */
  getStats(): OptimizationStats {
    const batchCount = this.stats.batchedRequests;
    const averageBatchSize = batchCount > 0 
      ? this.stats.batchedRequests / Math.max(1, Math.floor(batchCount / this.maxBatchSize))
      : 0;

    return {
      ...this.stats,
      averageBatchSize: Math.round(averageBatchSize * 100) / 100
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      deduplicatedRequests: 0,
      batchedRequests: 0,
      totalRequests: 0,
      averageBatchSize: 0,
      promptOptimizations: 0,
      parameterOptimizations: 0
    };
  }

  /**
   * Process batched image requests
   */
  private async processBatch(
    generator: (prompts: string[], options: ImageGenerationOptions) => Promise<any[]>
  ): Promise<void> {
    if (this.imageBatchQueue.length === 0) return;

    const batch = this.imageBatchQueue.splice(0, this.maxBatchSize);
    this.batchTimer = null;

    console.log(`Processing image batch of ${batch.length} requests`);
    this.stats.batchedRequests += batch.length;

    try {
      // Group by similar options to optimize batching
      const groups = this.groupBatchByOptions(batch);
      
      for (const group of groups) {
        const prompts = group.requests.map(req => req.prompt);
        const options = group.options;

        try {
          const results = await generator(prompts, options);
          
          // Resolve individual requests
          group.requests.forEach((request, index) => {
            if (results[index]) {
              request.resolve(results[index]);
            } else {
              request.reject(new Error('Batch generation failed for this item'));
            }
          });
        } catch (error) {
          // Reject all requests in this group
          group.requests.forEach(request => request.reject(error));
        }
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
      // Reject all requests
      batch.forEach(request => request.reject(error));
    }

    // Process remaining items if any
    if (this.imageBatchQueue.length > 0) {
      this.batchTimer = setTimeout(() => {
        this.processBatch(generator);
      }, this.batchDelay);
    }
  }

  /**
   * Group batch requests by similar options
   */
  private groupBatchByOptions(batch: BatchRequest[]): Array<{
    options: ImageGenerationOptions;
    requests: BatchRequest[];
  }> {
    const groups = new Map<string, BatchRequest[]>();

    batch.forEach(request => {
      const optionsKey = JSON.stringify(request.options, Object.keys(request.options).sort());
      
      if (!groups.has(optionsKey)) {
        groups.set(optionsKey, []);
      }
      groups.get(optionsKey)!.push(request);
    });

    return Array.from(groups.entries()).map(([optionsKey, requests]) => ({
      options: requests[0].options,
      requests
    }));
  }

  /**
   * Clean up expired pending requests
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, request] of this.pendingRequests) {
      if (now - request.timestamp > 60000) { // 1 minute timeout
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      const request = this.pendingRequests.get(key);
      if (request) {
        // Reject all subscribers
        const timeoutError = new Error('Request timeout during deduplication');
        request.subscribers.forEach(sub => sub.reject(timeoutError));
        this.pendingRequests.delete(key);
      }
    });

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired pending requests`);
    }
  }

  /**
   * Generate request key for deduplication
   */
  generateRequestKey(type: string, prompt: string, options: any): string {
    const optionsHash = this.hashObject(options);
    const promptHash = this.hashString(prompt);
    return `${type}:${promptHash}:${optionsHash}`;
  }

  /**
   * Hash string for keys
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
   * Hash object for keys
   */
  private hashObject(obj: any): string {
    return this.hashString(JSON.stringify(obj, Object.keys(obj).sort()));
  }
}

// Export singleton instance
export const requestOptimizer = new RequestOptimizerService();

export default RequestOptimizerService;
