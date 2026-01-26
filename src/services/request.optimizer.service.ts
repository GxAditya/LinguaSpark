import type { TextGenerationOptions, ImageGenerationOptions } from './pollinations.service.js';

/**
 * Client-side request deduplication entry
 */
interface ClientPendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
  subscribers: Array<{
    resolve: (value: T) => void;
    reject: (error: any) => void;
  }>;
}

/**
 * Client-side optimization statistics
 */
interface ClientOptimizationStats {
  deduplicatedRequests: number;
  totalRequests: number;
  promptOptimizations: number;
  parameterOptimizations: number;
  averageResponseTime: number;
}

/**
 * Client-side Request Optimizer Service
 * Implements request deduplication and prompt optimization for client-side requests
 */
export class ClientRequestOptimizerService {
  private pendingRequests = new Map<string, ClientPendingRequest<any>>();
  
  // Statistics tracking
  private stats: ClientOptimizationStats = {
    deduplicatedRequests: 0,
    totalRequests: 0,
    promptOptimizations: 0,
    parameterOptimizations: 0,
    averageResponseTime: 0
  };

  private responseTimes: number[] = [];

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
    ttl: number = 15000 // 15 seconds for client-side
  ): Promise<T> {
    this.stats.totalRequests++;

    // Check if there's already a pending request for this key
    const existing = this.pendingRequests.get(key);
    if (existing && Date.now() - existing.timestamp < ttl) {
      this.stats.deduplicatedRequests++;
      console.log(`Client deduplicating request: ${key}`);
      
      // Return a promise that resolves when the existing request completes
      return new Promise<T>((resolve, reject) => {
        existing.subscribers.push({ resolve, reject });
      });
    }

    // Create new request
    const subscribers: Array<{ resolve: (value: T) => void; reject: (error: any) => void }> = [];
    const startTime = Date.now();
    
    const promise = requestFn()
      .then((result) => {
        // Track response time
        const responseTime = Date.now() - startTime;
        this.responseTimes.push(responseTime);
        if (this.responseTimes.length > 50) {
          this.responseTimes.shift(); // Keep only last 50 entries
        }
        this.updateAverageResponseTime();

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
   * Optimize prompt length and content for client-side requests
   */
  optimizePrompt(prompt: string, type: 'text' | 'image' | 'game-content'): string {
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
        'be sure to',
        'you should',
        'you must'
      ];
      
      redundantPhrases.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (regex.test(optimized)) {
          optimized = optimized.replace(regex, '').replace(/\s+/g, ' ').trim();
          wasOptimized = true;
        }
      });

      // Limit length for text generation (optimal range: 50-400 characters for client)
      if (optimized.length > 400) {
        optimized = optimized.substring(0, 397) + '...';
        wasOptimized = true;
      }
      
    } else if (type === 'image') {
      // Image prompt optimizations
      
      // Add style keywords if missing for better consistency
      const styleKeywords = ['icon', 'simple', 'clean', 'minimalist', 'flat'];
      const hasStyleKeyword = styleKeywords.some(keyword => 
        optimized.toLowerCase().includes(keyword)
      );
      
      if (!hasStyleKeyword && optimized.length < 80) {
        optimized += ', simple icon, clean style';
        wasOptimized = true;
      }

      // Remove verbose descriptions that don't help image generation
      const verbosePatterns = [
        /\b(very|extremely|really|quite|rather|pretty|fairly)\s+/gi,
        /\b(high quality|high resolution|detailed|realistic|photorealistic)\s*/gi,
        /\b(professional|premium|luxury|expensive)\s*/gi
      ];
      
      verbosePatterns.forEach(pattern => {
        if (pattern.test(optimized)) {
          optimized = optimized.replace(pattern, '').replace(/\s+/g, ' ').trim();
          wasOptimized = true;
        }
      });

      // Limit length for image generation (optimal range: 20-120 characters)
      if (optimized.length > 120) {
        optimized = optimized.substring(0, 117) + '...';
        wasOptimized = true;
      }
      
    } else if (type === 'game-content') {
      // Game content prompt optimizations
      
      // Ensure clarity and conciseness for game content
      const gameRedundantPhrases = [
        'create a game',
        'generate content for',
        'make a',
        'build a',
        'design a'
      ];
      
      gameRedundantPhrases.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        if (regex.test(optimized)) {
          optimized = optimized.replace(regex, '').replace(/\s+/g, ' ').trim();
          wasOptimized = true;
        }
      });

      // Limit length for game content (optimal range: 100-600 characters)
      if (optimized.length > 600) {
        optimized = optimized.substring(0, 597) + '...';
        wasOptimized = true;
      }
    }

    if (wasOptimized || optimized.length !== originalLength) {
      this.stats.promptOptimizations++;
      console.log(`Client optimized ${type} prompt: ${originalLength} -> ${optimized.length} chars`);
    }

    return optimized;
  }

  /**
   * Optimize generation parameters for client-side requests
   */
  optimizeParameters(
    options: TextGenerationOptions | ImageGenerationOptions | any,
    type: 'text' | 'image' | 'game-content'
  ): any {
    let optimized = { ...options };
    let wasOptimized = false;

    if (type === 'text') {
      const textOptions = optimized as TextGenerationOptions;
      
      // Optimize temperature for client-side use
      if (textOptions.temperature === undefined) {
        textOptions.temperature = 0.7; // Good default for most use cases
        wasOptimized = true;
      } else if (textOptions.temperature > 0.9) {
        textOptions.temperature = 0.9; // Cap for consistency
        wasOptimized = true;
      }

      // Optimize max_tokens for client-side efficiency
      if (textOptions.maxTokens === undefined) {
        textOptions.maxTokens = 800; // Reasonable default for client
        wasOptimized = true;
      } else if (textOptions.maxTokens > 2000) {
        textOptions.maxTokens = 2000; // Cap to prevent excessive costs
        wasOptimized = true;
      }

    } else if (type === 'image') {
      const imageOptions = optimized as ImageGenerationOptions;
      
      // Optimize image dimensions for client use
      if (!imageOptions.width && !imageOptions.height) {
        imageOptions.width = 256;
        imageOptions.height = 256;
        wasOptimized = true;
      }

      // Ensure dimensions are reasonable for client-side display
      if (imageOptions.width && imageOptions.width > 512) {
        imageOptions.width = 512;
        wasOptimized = true;
      }
      if (imageOptions.height && imageOptions.height > 512) {
        imageOptions.height = 512;
        wasOptimized = true;
      }

      // Default enhance to false for faster generation
      if (imageOptions.enhance === undefined) {
        imageOptions.enhance = false;
        wasOptimized = true;
      }
      
    } else if (type === 'game-content') {
      // Game content parameter optimizations
      
      // Ensure reasonable defaults for game content
      if (!optimized.rounds || optimized.rounds > 10) {
        optimized.rounds = 5; // Reasonable default
        wasOptimized = true;
      }

      // Optimize difficulty if not specified
      if (!optimized.difficulty) {
        optimized.difficulty = 'intermediate'; // Good default
        wasOptimized = true;
      }
    }

    if (wasOptimized) {
      this.stats.parameterOptimizations++;
      console.log(`Client optimized ${type} parameters`);
    }

    return optimized;
  }

  /**
   * Batch multiple similar requests (simplified for client-side)
   */
  async batchSimilarRequests<T>(
    requests: Array<{
      key: string;
      requestFn: () => Promise<T>;
    }>,
    delay: number = 1000
  ): Promise<T[]> {
    // For client-side, we'll use a simple delay-based batching
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const results = await Promise.allSettled(
            requests.map(req => this.deduplicateRequest(req.key, req.requestFn))
          );
          
          const successfulResults = results.map(result => 
            result.status === 'fulfilled' ? result.value : null
          ).filter(Boolean);
          
          resolve(successfulResults);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }

  /**
   * Get optimization statistics
   */
  getStats(): ClientOptimizationStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      deduplicatedRequests: 0,
      totalRequests: 0,
      promptOptimizations: 0,
      parameterOptimizations: 0,
      averageResponseTime: 0
    };
    this.responseTimes = [];
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(): void {
    if (this.responseTimes.length > 0) {
      this.stats.averageResponseTime = Math.round(
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      );
    }
  }

  /**
   * Clean up expired pending requests
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, request] of this.pendingRequests) {
      if (now - request.timestamp > 30000) { // 30 seconds timeout for client
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      const request = this.pendingRequests.get(key);
      if (request) {
        // Reject all subscribers
        const timeoutError = new Error('Client request timeout during deduplication');
        request.subscribers.forEach(sub => sub.reject(timeoutError));
        this.pendingRequests.delete(key);
      }
    });

    if (expiredKeys.length > 0) {
      console.log(`Client cleaned up ${expiredKeys.length} expired pending requests`);
    }
  }

  /**
   * Generate request key for deduplication
   */
  generateRequestKey(type: string, prompt: string, options: any): string {
    const optionsHash = this.hashObject(options);
    const promptHash = this.hashString(prompt);
    return `client:${type}:${promptHash}:${optionsHash}`;
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
export const clientRequestOptimizer = new ClientRequestOptimizerService();

export default ClientRequestOptimizerService;