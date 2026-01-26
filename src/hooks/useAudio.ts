import { useState, useCallback, useRef, useEffect } from 'react';
import { audioService, AudioPlaybackOptions, AudioServiceResult } from '../services/audio.service';

export interface UseAudioState {
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  currentText: string | null;
}

export interface UseAudioActions {
  playText: (text: string, voice?: string, options?: AudioPlaybackOptions) => Promise<void>;
  stopAudio: () => void;
  clearError: () => void;
  preloadTexts: (texts: string[], voice?: string) => Promise<void>;
}

export interface UseAudioReturn extends UseAudioState, UseAudioActions {
  cacheStats: { size: number; maxSize: number; ttl: number };
}

/**
 * Custom hook for audio functionality with caching and error handling
 */
export function useAudio(): UseAudioReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  
  const loadingTimeoutRef = useRef<number | null>(null);

  // Clear loading timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const playText = useCallback(async (
    text: string, 
    voice: string = 'alloy',
    options: AudioPlaybackOptions = {}
  ): Promise<void> => {
    if (!text.trim()) {
      setError('No text provided for audio playback');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setCurrentText(text);

      // Set a timeout for loading state (in case API is slow)
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.warn('Audio generation taking longer than expected');
        }
      }, 5000);

      // Generate audio
      const result: AudioServiceResult = await audioService.generateAudio(text, voice);
      
      // Clear loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      setIsLoading(false);

      // Enhanced options with state management
      const enhancedOptions: AudioPlaybackOptions = {
        ...options,
        onStart: () => {
          setIsPlaying(true);
          options.onStart?.();
        },
        onEnd: () => {
          setIsPlaying(false);
          setCurrentText(null);
          options.onEnd?.();
        },
        onError: (audioError: Error) => {
          setIsPlaying(false);
          setCurrentText(null);
          setError(`Audio playback failed: ${audioError.message}`);
          options.onError?.(audioError);
        }
      };

      // Handle browser TTS fallback differently
      if (result.provider === 'browser') {
        // For browser TTS, use the fallback method
        await playBrowserTTS(text, enhancedOptions);
      } else {
        // For API-generated audio, use the audio service
        await audioService.playAudio(result.audioUrl, enhancedOptions);
      }

    } catch (err) {
      // Clear loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      setIsLoading(false);
      setIsPlaying(false);
      setCurrentText(null);
      
      const errorMessage = err instanceof Error ? err.message : 'Audio generation failed';
      setError(errorMessage);
      
      // Try browser TTS as final fallback
      try {
        await playBrowserTTS(text, {
          ...options,
          onStart: () => {
            setIsPlaying(true);
            options.onStart?.();
          },
          onEnd: () => {
            setIsPlaying(false);
            setCurrentText(null);
            options.onEnd?.();
          },
          onError: (audioError: Error) => {
            setIsPlaying(false);
            setCurrentText(null);
            setError(`All audio methods failed: ${audioError.message}`);
            options.onError?.(audioError);
          }
        });
        setError(null); // Clear error if browser TTS works
      } catch (fallbackError) {
        console.error('All audio methods failed:', fallbackError);
      }
    }
  }, [isLoading]);

  const stopAudio = useCallback(() => {
    audioService.stopCurrentAudio();
    
    // Also stop browser TTS if it's running
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setCurrentText(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const preloadTexts = useCallback(async (
    texts: string[], 
    voice: string = 'alloy'
  ): Promise<void> => {
    try {
      await audioService.preloadAudio(texts, voice);
    } catch (err) {
      console.warn('Failed to preload some audio:', err);
    }
  }, []);

  return {
    // State
    isLoading,
    isPlaying,
    error,
    currentText,
    
    // Actions
    playText,
    stopAudio,
    clearError,
    preloadTexts,
    
    // Cache info
    cacheStats: audioService.getCacheStats()
  };
}

/**
 * Fallback browser TTS function
 */
async function playBrowserTTS(
  text: string, 
  options: AudioPlaybackOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Browser TTS not supported'));
      return;
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.playbackRate || 0.8;
      utterance.volume = options.volume || 1.0;

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = new Error(`Browser TTS error: ${event.error}`);
        options.onError?.(error);
        reject(error);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      const ttsError = error instanceof Error ? error : new Error('Browser TTS failed');
      options.onError?.(ttsError);
      reject(ttsError);
    }
  });
}

export default useAudio;