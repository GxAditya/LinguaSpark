import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../useAudio';

// Mock the audio service
vi.mock('../services/audio.service', () => ({
  audioService: {
    generateAudio: vi.fn(),
    playAudio: vi.fn(),
    stopCurrentAudio: vi.fn(),
    getCacheStats: vi.fn(() => ({ size: 0, maxSize: 100, ttl: 1800000 })),
    preloadAudio: vi.fn()
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

describe('useAudio Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAudio());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.currentText).toBe(null);
    expect(typeof result.current.playText).toBe('function');
    expect(typeof result.current.stopAudio).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
    expect(typeof result.current.preloadTexts).toBe('function');
  });

  it('should handle empty text input', async () => {
    const { result } = renderHook(() => useAudio());

    await act(async () => {
      await result.current.playText('');
    });

    expect(result.current.error).toBe('No text provided for audio playback');
  });

  it('should clear error when clearError is called', async () => {
    const { result } = renderHook(() => useAudio());

    // Set an error first
    await act(async () => {
      await result.current.playText('');
    });

    expect(result.current.error).toBeTruthy();

    // Clear the error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('should provide cache statistics', () => {
    const { result } = renderHook(() => useAudio());

    expect(result.current.cacheStats).toHaveProperty('size');
    expect(result.current.cacheStats).toHaveProperty('maxSize');
    expect(result.current.cacheStats).toHaveProperty('ttl');
  });

  it('should handle stopAudio call', () => {
    const { result } = renderHook(() => useAudio());

    expect(() => {
      act(() => {
        result.current.stopAudio();
      });
    }).not.toThrow();
  });
});