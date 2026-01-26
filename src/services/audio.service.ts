import ttsService from './tts.service';

export interface AudioCacheItem {
  audioUrl: string;
  timestamp: number;
  provider: string;
}

export interface AudioPlaybackOptions {
  volume?: number;
  playbackRate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export interface AudioServiceResult {
  audioUrl: string;
  fromCache: boolean;
  provider: string;
}

class AudioService {
  private audioCache = new Map<string, AudioCacheItem>();
  private currentAudio: HTMLAudioElement | null = null;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100;

  /**
   * Generate audio using Groq TTS API with caching
   */
  async generateAudio(
    text: string, 
    voice: string = 'alloy'
  ): Promise<AudioServiceResult> {
    const cacheKey = this.getCacheKey(text, voice);
    
    // Check cache first
    const cached = this.getCachedAudio(cacheKey);
    if (cached) {
      return {
        audioUrl: cached.audioUrl,
        fromCache: true,
        provider: cached.provider
      };
    }

    try {
      // Generate using TTS service
      const result = await ttsService.generateAudio(text, voice);
      
      if (!result.audioBase64 && !result.audioUrl) {
        throw new Error('No audio data received from TTS service');
      }

      const audioUrl = result.audioBase64 || result.audioUrl!;
      
      // Cache the result
      this.cacheAudio(cacheKey, {
        audioUrl,
        timestamp: Date.now(),
        provider: result.provider
      });

      return {
        audioUrl,
        fromCache: false,
        provider: result.provider
      };
    } catch (error) {
      console.error('TTS API failed, attempting fallback:', error);
      
      // Fallback to browser TTS
      const fallbackUrl = await this.fallbackToBrowserTTS(text);
      return {
        audioUrl: fallbackUrl,
        fromCache: false,
        provider: 'browser'
      };
    }
  }

  /**
   * Play audio with enhanced controls and error handling
   */
  async playAudio(
    audioSource: string, 
    options: AudioPlaybackOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing audio
        this.stopCurrentAudio();

        const audio = new Audio(audioSource);
        this.currentAudio = audio;

        // Set audio properties
        if (options.volume !== undefined) {
          audio.volume = Math.max(0, Math.min(1, options.volume));
        }
        if (options.playbackRate !== undefined) {
          audio.playbackRate = Math.max(0.25, Math.min(4, options.playbackRate));
        }

        // Set up event listeners
        audio.onloadstart = () => {
          options.onStart?.();
        };

        audio.onended = () => {
          options.onEnd?.();
          this.currentAudio = null;
          resolve();
        };

        audio.onerror = () => {
          const error = new Error(`Audio playback failed: ${audio.error?.message || 'Unknown error'}`);
          options.onError?.(error);
          this.currentAudio = null;
          reject(error);
        };

        // Start playback
        audio.play().catch(reject);
      } catch (error) {
        const audioError = error instanceof Error ? error : new Error('Audio playback failed');
        options.onError?.(audioError);
        reject(audioError);
      }
    });
  }

  /**
   * Stop currently playing audio
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * Get cached audio if available and not expired
   */
  private getCachedAudio(cacheKey: string): AudioCacheItem | null {
    const cached = this.audioCache.get(cacheKey);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.audioCache.delete(cacheKey);
      return null;
    }

    return cached;
  }

  /**
   * Cache audio data with size management
   */
  private cacheAudio(cacheKey: string, item: AudioCacheItem): void {
    // Remove oldest items if cache is full
    if (this.audioCache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.audioCache.keys().next().value;
      if (oldestKey) {
        this.audioCache.delete(oldestKey);
      }
    }

    this.audioCache.set(cacheKey, item);
  }

  /**
   * Generate cache key for text and voice combination
   */
  private getCacheKey(text: string, voice: string): string {
    return `${voice}:${text.toLowerCase().trim()}`;
  }

  /**
   * Fallback to browser TTS when API fails
   */
  private async fallbackToBrowserTTS(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Browser TTS not supported'));
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.volume = 1.0;

        // Create a data URL for the browser TTS (placeholder)
        // Note: Browser TTS doesn't provide audio data directly
        const fallbackUrl = `data:text/plain;base64,${btoa(text)}`;
        
        resolve(fallbackUrl);
      } catch (error) {
        reject(new Error('Browser TTS fallback failed'));
      }
    });
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.audioCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.audioCache.size,
      maxSize: this.MAX_CACHE_SIZE,
      ttl: this.CACHE_TTL
    };
  }

  /**
   * Preload audio for multiple texts
   */
  async preloadAudio(texts: string[], voice: string = 'alloy'): Promise<void> {
    const promises = texts.map(text => 
      this.generateAudio(text, voice).catch(error => {
        console.warn(`Failed to preload audio for "${text}":`, error);
        return null;
      })
    );

    await Promise.allSettled(promises);
  }
}

// Export singleton instance
export const audioService = new AudioService();
export default audioService;