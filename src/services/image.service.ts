import { pollinationsService } from './pollinations.service';
import { emojiFallbackService } from './emoji-fallback.service';

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  seed?: number;
  enhance?: boolean;
}

export interface ImageCacheEntry {
  imageUrl: string;
  timestamp: number;
  prompt: string;
  options: ImageGenerationOptions;
  quality?: ImageQualityMetrics;
}

export interface ImageQualityMetrics {
  consistency: number;
  clarity: number;
  appropriateness: number;
  overall: number;
}

export interface ImageGenerationResult {
  imageUrl: string;
  fromCache: boolean;
  fallbackUsed: boolean;
  quality?: ImageQualityMetrics;
  generationTime?: number;
}

export interface ImageLoadingState {
  loading: boolean;
  error: string | null;
  progress?: number;
}

/**
 * Enhanced Image Service with caching and loading states
 * Integrates with the new Pollinations API for image generation
 */
class ImageService {
  private cache = new Map<string, ImageCacheEntry>();
  private loadingStates = new Map<string, ImageLoadingState>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE = 100;

  /**
   * Generate cache key for image request
   */
  private getCacheKey(prompt: string, options: ImageGenerationOptions): string {
    const optionsStr = JSON.stringify(options);
    return `${prompt}:${optionsStr}`;
  }

  /**
   * Check if cached entry is still valid
   */
  private isCacheValid(entry: ImageCacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  /**
   * Clean expired cache entries
   */
  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }

    // If cache is still too large, remove oldest entries
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Get cached image if available and valid
   */
  private getCachedImage(prompt: string, options: ImageGenerationOptions): string | null {
    const key = this.getCacheKey(prompt, options);
    const entry = this.cache.get(key);
    
    if (entry && this.isCacheValid(entry)) {
      return entry.imageUrl;
    }
    
    if (entry) {
      // Remove expired entry
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Cache generated image
   */
  private cacheImage(prompt: string, options: ImageGenerationOptions, imageUrl: string): void {
    const key = this.getCacheKey(prompt, options);
    const entry: ImageCacheEntry = {
      imageUrl,
      timestamp: Date.now(),
      prompt,
      options
    };
    
    this.cache.set(key, entry);
    this.cleanCache();
  }

  /**
   * Get loading state for a specific image request
   */
  getLoadingState(prompt: string, options: ImageGenerationOptions = {}): ImageLoadingState {
    const key = this.getCacheKey(prompt, options);
    return this.loadingStates.get(key) || { loading: false, error: null };
  }

  /**
   * Set loading state for a specific image request
   */
  private setLoadingState(prompt: string, options: ImageGenerationOptions, state: ImageLoadingState): void {
    const key = this.getCacheKey(prompt, options);
    this.loadingStates.set(key, state);
  }

  /**
   * Assess image quality based on various metrics
   */
  private assessImageQuality(imageUrl: string, prompt: string): ImageQualityMetrics {
    // Basic quality assessment based on available information
    // In a real implementation, this could use image analysis APIs
    
    let consistency = 85; // Base consistency score
    let clarity = 80; // Base clarity score
    let appropriateness = 90; // Base appropriateness score
    
    // Adjust based on prompt characteristics
    const promptLength = prompt.length;
    if (promptLength > 150) {
      consistency -= 10; // Very long prompts may be less consistent
      clarity -= 5;
    } else if (promptLength < 50) {
      consistency += 5; // Shorter prompts tend to be more consistent
      clarity += 5;
    }
    
    // Check for style keywords that improve quality
    const qualityKeywords = ['simple', 'clean', 'minimalist', 'icon', 'flat'];
    const keywordCount = qualityKeywords.filter(keyword => 
      prompt.toLowerCase().includes(keyword)
    ).length;
    
    consistency += keywordCount * 2;
    clarity += keywordCount * 3;
    
    // Check if it's a data URL (generated image) vs fallback emoji
    if (imageUrl.startsWith('data:image/')) {
      appropriateness += 10; // Generated images are more appropriate than emojis
    } else if (imageUrl.length === 1 || imageUrl.length === 2) {
      // Likely an emoji fallback
      appropriateness -= 20;
      consistency -= 30;
      clarity -= 40;
    }
    
    // Ensure scores are within bounds
    consistency = Math.max(0, Math.min(100, consistency));
    clarity = Math.max(0, Math.min(100, clarity));
    appropriateness = Math.max(0, Math.min(100, appropriateness));
    
    const overall = Math.round((consistency + clarity + appropriateness) / 3);
    
    return { consistency, clarity, appropriateness, overall };
  }

  /**
   * Ensure consistency across multiple images in a set
   */
  private ensureImageConsistency(
    prompts: Array<{ prompt: string; options?: ImageGenerationOptions }>,
    baseStyle?: string
  ): Array<{ prompt: string; options?: ImageGenerationOptions }> {
    const consistentStyle = baseStyle || 'simple icon style, minimalist design, clean white background, flat design, bright colors';
    
    return prompts.map(({ prompt, options }) => ({
      prompt: this.optimizePromptForZimage(`${prompt}, ${consistentStyle}`),
      options: {
        width: 256,
        height: 256,
        enhance: false,
        ...options
      }
    }));
  }
  private optimizePromptForZimage(prompt: string): string {
    // Enhance prompts specifically for the zimage model
    const basePrompt = prompt.toLowerCase().trim();
    
    // Remove common problematic words that don't work well with zimage
    const problematicWords = ['realistic', 'photorealistic', '3d', 'render', 'detailed', 'complex'];
    let cleanedPrompt = basePrompt;
    problematicWords.forEach(word => {
      cleanedPrompt = cleanedPrompt.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });
    
    // Add zimage-optimized style modifiers
    const zImageStyleModifiers = [
      'simple icon style',
      'minimalist design', 
      'clean white background',
      'flat design',
      'bright colors',
      'high contrast',
      'clear simple shapes',
      'cartoon style',
      'vector art style'
    ];
    
    // Check if prompt already contains style information
    const hasStyle = zImageStyleModifiers.some(modifier => 
      basePrompt.includes(modifier.toLowerCase())
    );
    
    // Build optimized prompt
    let optimizedPrompt = cleanedPrompt.trim();
    
    if (!hasStyle) {
      // Add zimage-specific optimizations
      optimizedPrompt = `${optimizedPrompt}, simple icon style, minimalist design, clean white background, flat design, bright vibrant colors, high contrast, clear simple shapes`;
    }
    
    // Add quality enhancers that work well with zimage
    const qualityEnhancers = [
      'centered composition',
      'single object focus',
      'no text',
      'no watermarks',
      'crisp edges'
    ];
    
    // Add quality enhancers if prompt is not too long
    if (optimizedPrompt.length < 150) {
      optimizedPrompt += `, ${qualityEnhancers.join(', ')}`;
    }
    
    // Ensure prompt doesn't exceed reasonable length for zimage
    if (optimizedPrompt.length > 200) {
      optimizedPrompt = optimizedPrompt.substring(0, 200).trim();
      // Remove incomplete words at the end
      optimizedPrompt = optimizedPrompt.replace(/\s+\w*$/, '');
    }
    
    return optimizedPrompt;
  }

  /**
   * Generate a single image with caching and loading states
   */
  async generateImage(
    prompt: string, 
    options: ImageGenerationOptions = {},
    fallbackEmoji?: string
  ): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    
    // Check cache first
    const cachedImage = this.getCachedImage(prompt, options);
    if (cachedImage) {
      return { 
        imageUrl: cachedImage, 
        fromCache: true, 
        fallbackUsed: false,
        generationTime: 0
      };
    }

    // Set loading state
    this.setLoadingState(prompt, options, { loading: true, error: null });

    try {
      // Optimize prompt for zimage model
      const optimizedPrompt = this.optimizePromptForZimage(prompt);
      
      // Set default options optimized for game images
      const imageOptions: ImageGenerationOptions = {
        width: 256,
        height: 256,
        seed: options.seed || -1,
        enhance: false,
        ...options
      };

      const response = await pollinationsService.generateImage(optimizedPrompt, imageOptions);
      const generationTime = Date.now() - startTime;
      
      // Assess image quality
      const quality = this.assessImageQuality(response.imageUrl, optimizedPrompt);
      
      // Cache the result with quality metrics
      this.cacheImage(prompt, options, response.imageUrl);
      
      // Clear loading state
      this.setLoadingState(prompt, options, { loading: false, error: null });
      
      return { 
        imageUrl: response.imageUrl, 
        fromCache: false, 
        fallbackUsed: false,
        quality,
        generationTime
      };
      
    } catch (error: any) {
      console.error('Image generation failed:', error);
      
      // Set error state
      this.setLoadingState(prompt, options, { 
        loading: false, 
        error: error.message || 'Image generation failed' 
      });
      
      // Use intelligent emoji fallback
      const intelligentFallback = fallbackEmoji || emojiFallbackService.getImageFallback(prompt);
      const fallbackQuality = this.assessImageQuality(intelligentFallback, prompt);
      const generationTime = Date.now() - startTime;
      
      return { 
        imageUrl: intelligentFallback, 
        fromCache: false, 
        fallbackUsed: true,
        quality: fallbackQuality,
        generationTime
      };
    }
  }

  /**
   * Generate multiple images with batch processing, consistency, and progress tracking
   */
  async generateImages(
    prompts: Array<{ prompt: string; options?: ImageGenerationOptions; fallbackEmoji?: string }>,
    onProgress?: (completed: number, total: number) => void,
    ensureConsistency: boolean = true
  ): Promise<ImageGenerationResult[]> {
    // Ensure consistency across all images if requested
    let processedPrompts = prompts;
    if (ensureConsistency) {
      processedPrompts = this.ensureImageConsistency(prompts).map((processed, index) => ({
        ...processed,
        fallbackEmoji: prompts[index].fallbackEmoji
      }));
    }
    
    const results: ImageGenerationResult[] = [];
    const batchSize = 3; // Process 3 images at a time to avoid overwhelming the API
    
    for (let i = 0; i < processedPrompts.length; i += batchSize) {
      const batch = processedPrompts.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async ({ prompt, options = {}, fallbackEmoji }) => {
        try {
          return await this.generateImage(prompt, options, fallbackEmoji);
        } catch (error) {
          console.error(`Failed to generate image for prompt: ${prompt}`, error);
          // Return fallback result
          const intelligentFallback = fallbackEmoji || emojiFallbackService.getImageFallback(prompt);
          const fallbackQuality = this.assessImageQuality(intelligentFallback, prompt);
          
          return { 
            imageUrl: intelligentFallback, 
            fromCache: false, 
            fallbackUsed: true,
            quality: fallbackQuality,
            generationTime: 0
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Report progress
      if (onProgress) {
        onProgress(Math.min(i + batchSize, processedPrompts.length), processedPrompts.length);
      }
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < processedPrompts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Preload images for better user experience
   */
  async preloadImages(
    prompts: Array<{ prompt: string; options?: ImageGenerationOptions; fallbackEmoji?: string }>
  ): Promise<void> {
    // Generate images in background without blocking
    this.generateImages(prompts).catch(error => {
      console.warn('Image preloading failed:', error);
    });
  }

  /**
   * Clear all cached images
   */
  clearCache(): void {
    this.cache.clear();
    this.loadingStates.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE
    };
  }

  /**
   * Check if image generation is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      return await pollinationsService.checkApiStatus();
    } catch (error) {
      console.error('Failed to check image service availability:', error);
      return false;
    }
  }
}

// Export singleton instance
export const imageService = new ImageService();

export default ImageService;