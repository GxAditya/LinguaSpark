import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { audioService } from '../audio.service';

// Mock the TTS service
vi.mock('../tts.service', () => ({
  default: {
    generateAudio: vi.fn()
  }
}));

// Mock browser APIs
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn()
  }
});

Object.defineProperty(window, 'Audio', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    currentTime: 0,
    volume: 1,
    playbackRate: 1,
    onloadstart: null,
    onended: null,
    onerror: null
  }))
});

describe('AudioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    audioService.clearCache();
  });

  afterEach(() => {
    audioService.stopCurrentAudio();
  });

  describe('Cache Management', () => {
    it('should provide cache statistics', () => {
      const stats = audioService.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('ttl');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
      expect(typeof stats.ttl).toBe('number');
    });

    it('should clear cache', () => {
      audioService.clearCache();
      const stats = audioService.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('Audio Control', () => {
    it('should report playing state correctly', () => {
      expect(audioService.isPlaying()).toBe(false);
    });

    it('should stop current audio', () => {
      expect(() => audioService.stopCurrentAudio()).not.toThrow();
    });
  });

  describe('Preload Functionality', () => {
    it('should handle preload requests without throwing', async () => {
      const texts = ['hello', 'world'];
      await expect(audioService.preloadAudio(texts)).resolves.not.toThrow();
    });
  });
});