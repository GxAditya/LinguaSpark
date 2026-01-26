import api from './api.js';
import { ErrorService, ApiError } from './error.service.js';
import { fallbackContentService, FallbackContentOptions } from './fallback-content.service.js';
import { errorMonitoringService } from './error-monitoring.service.js';
import { clientRequestCache } from './request.cache.service.js';
import { clientRequestOptimizer } from './request.optimizer.service.js';

export interface TextGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  seed?: number;
}

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  seed?: number;
  enhance?: boolean;
}

export interface GameContentOptions {
  gameType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  targetLanguage: string;
  rounds?: number;
}

export interface TextResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ImageResponse {
  imageUrl: string;
  model: string;
  parameters: ImageGenerationOptions;
}

export interface GameContent {
  type: string;
  difficulty: string;
  language: string;
  targetLanguage: string;
  rounds: any[];
  instructions?: string;
  metadata?: {
    isFallback?: boolean;
    generatedAt?: string;
    reason?: string;
  };
}

/**
 * Enhanced Client-side Pollinations Service with comprehensive error handling and advanced caching
 * Communicates with the server-side Pollinations API service
 */
class PollinationsService {

  /**
   * Generate text content using the server-side Pollinations API with retry logic, caching, and optimization
   */
  async generateText(prompt: string, options: TextGenerationOptions = {}): Promise<TextResponse> {
    // Optimize prompt and parameters
    const optimizedPrompt = clientRequestOptimizer.optimizePrompt(prompt, 'text');
    const optimizedOptions = clientRequestOptimizer.optimizeParameters(options, 'text') as TextGenerationOptions;
    
    const cacheKey = {
      type: 'text' as const,
      prompt: optimizedPrompt,
      options: optimizedOptions
    };

    // Use request deduplication
    const requestKey = clientRequestOptimizer.generateRequestKey('text', optimizedPrompt, optimizedOptions);
    
    return clientRequestOptimizer.deduplicateRequest(
      requestKey,
      () => clientRequestCache.getOrGenerate(
        cacheKey,
        async () => {
          return ErrorService.retryWithBackoff(
            async () => {
              try {
                const response = await api.post<TextResponse>('/pollinations/text', {
                  prompt: optimizedPrompt,
                  options: optimizedOptions
                });

                if (!response.success || !response.data) {
                  throw new Error(response.message || 'Text generation failed');
                }
                
                return response.data;
              } catch (error: any) {
                const apiError = ErrorService.parseError(error, {
                  operation: 'text_generation',
                  endpoint: '/pollinations/text'
                });

                // Log error for monitoring
                const errorId = errorMonitoringService.logError(apiError);

                // Check if we should use fallback
                if (ErrorService.shouldUseFallback(apiError)) {
                  console.warn('Text generation failed, attempting fallback...');
                  // For text generation, we don't have direct fallback content
                  // The calling code should handle this
                }

                throw apiError;
              }
            },
            {
              operation: 'text_generation',
              endpoint: '/pollinations/text',
              maxRetries: 3
            }
          );
        },
        900000 // 15 minutes TTL for client-side text cache
      ).then(result => result.data)
    );
  }

  /**
   * Generate image using the server-side Pollinations API with retry logic, caching, and optimization
   */
  async generateImage(prompt: string, options: ImageGenerationOptions = {}): Promise<ImageResponse> {
    // Optimize prompt and parameters
    const optimizedPrompt = clientRequestOptimizer.optimizePrompt(prompt, 'image');
    const optimizedOptions = clientRequestOptimizer.optimizeParameters(options, 'image') as ImageGenerationOptions;
    
    const cacheKey = {
      type: 'image' as const,
      prompt: optimizedPrompt,
      options: optimizedOptions
    };

    // Use request deduplication
    const requestKey = clientRequestOptimizer.generateRequestKey('image', optimizedPrompt, optimizedOptions);
    
    return clientRequestOptimizer.deduplicateRequest(
      requestKey,
      () => clientRequestCache.getOrGenerate(
        cacheKey,
        async () => {
          return ErrorService.retryWithBackoff(
            async () => {
              try {
                const response = await api.post<ImageResponse>('/pollinations/image', {
                  prompt: optimizedPrompt,
                  options: optimizedOptions
                });

                if (!response.success || !response.data) {
                  throw new Error(response.message || 'Image generation failed');
                }
                
                return response.data;
              } catch (error: any) {
                const apiError = ErrorService.parseError(error, {
                  operation: 'image_generation',
                  endpoint: '/pollinations/image'
                });

                // Log error for monitoring
                const errorId = errorMonitoringService.logError(apiError);

                throw apiError;
              }
            },
            {
              operation: 'image_generation',
              endpoint: '/pollinations/image',
              maxRetries: 2 // Fewer retries for images to save costs
            }
          );
        },
        1800000 // 30 minutes TTL for client-side image cache
      ).then(result => result.data)
    );
  }

  /**
   * Generate game content with comprehensive fallback system and caching
   */
  async generateGameContent(options: GameContentOptions): Promise<GameContent> {
    const cacheKey = {
      type: 'game-content' as const,
      gameType: options.gameType,
      options
    };

    return clientRequestCache.getOrGenerate(
      cacheKey,
      async () => {
        try {
          return await ErrorService.retryWithBackoff(
            async () => {
              try {
                const response = await api.post<GameContent>('/pollinations/game-content', options);

                if (!response.success || !response.data) {
                  throw new Error(response.message || 'Game content generation failed');
                }
                
                return response.data;
              } catch (error: any) {
                const apiError = ErrorService.parseError(error, {
                  gameType: options.gameType,
                  operation: 'game_content_generation',
                  endpoint: '/pollinations/game-content'
                });

                // Log error for monitoring
                const errorId = errorMonitoringService.logError(apiError);

                throw apiError;
              }
            },
            {
              gameType: options.gameType,
              operation: 'game_content_generation',
              endpoint: '/pollinations/game-content',
              maxRetries: 2
            }
          );
        } catch (error: any) {
          // If all retries failed, try fallback content
          if (ErrorService.shouldUseFallback(error)) {
            console.warn('Game content generation failed, using fallback content...');
            
            const fallbackOptions: FallbackContentOptions = {
              gameType: options.gameType,
              difficulty: options.difficulty,
              language: options.language,
              targetLanguage: options.targetLanguage
            };

            const fallbackContent = fallbackContentService.getFallbackContent(
              fallbackOptions, 
              error.type || 'API_FAILURE'
            );

            if (fallbackContent) {
              // Mark error as resolved with fallback
              const errorId = (error as any).errorId;
              if (errorId) {
                errorMonitoringService.resolveError(errorId, 'fallback');
              }

              console.info('Using fallback content for game:', options.gameType);
              return fallbackContent;
            }
          }

          // If no fallback available, re-throw the error
          throw error;
        }
      },
      600000 // 10 minutes TTL for game content cache
    ).then(result => result.data);
  }

  /**
   * Check if Pollinations API is available
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await api.get<{ available: boolean }>('/pollinations/status');
      return response.success && response.data?.available === true;
    } catch (error: any) {
      const apiError = ErrorService.parseError(error, {
        operation: 'status_check',
        endpoint: '/pollinations/status'
      });

      // Log error but don't throw - status check should be non-blocking
      errorMonitoringService.logError(apiError);
      
      console.warn('API status check failed:', apiError.message);
      return false;
    }
  }

  /**
   * Test API connection with minimal request
   */
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const response = await api.post<{ connected: boolean }>('/pollinations/test', {});
      
      if (response.success && response.data?.connected) {
        return { connected: true };
      } else {
        return { 
          connected: false, 
          error: response.message || 'Connection test failed' 
        };
      }
    } catch (error: any) {
      const apiError = ErrorService.parseError(error, {
        operation: 'connection_test',
        endpoint: '/pollinations/test'
      });

      errorMonitoringService.logError(apiError);
      
      return { 
        connected: false, 
        error: ErrorService.getUserFriendlyMessage(apiError)
      };
    }
  }

  /**
   * Get available fallback content options
   */
  getAvailableFallbackOptions(): {
    gameTypes: string[];
    difficulties: string[];
    languagePairs: Record<string, string[]>;
  } {
    const gameTypes = fallbackContentService.getSupportedGameTypes();
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    const languagePairs: Record<string, string[]> = {};

    gameTypes.forEach(gameType => {
      difficulties.forEach(difficulty => {
        const pairs = fallbackContentService.getAvailableLanguagePairs(gameType, difficulty);
        if (pairs.length > 0) {
          const key = `${gameType}-${difficulty}`;
          languagePairs[key] = pairs;
        }
      });
    });

    return { gameTypes, difficulties, languagePairs };
  }

  /**
   * Clear request cache
   */
  clearCache(): void {
    clientRequestCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    entries: Array<{ key: string; expires: string; size: number }>;
  } {
    const stats = clientRequestCache.getStats();
    return {
      size: stats.memoryEntries + stats.localStorageEntries,
      hitRate: stats.hitRate,
      entries: [] // Detailed entries not exposed for privacy
    };
  }

  /**
   * Get error monitoring statistics
   */
  getErrorStats(): {
    metrics: any;
    recentErrors: any[];
    trends: any;
  } {
    return {
      metrics: errorMonitoringService.getMetrics(),
      recentErrors: errorMonitoringService.getErrorLog({ limit: 10 }),
      trends: errorMonitoringService.getErrorTrends(24)
    };
  }
}

// Export singleton instance
export const pollinationsService = new PollinationsService();

export default PollinationsService;