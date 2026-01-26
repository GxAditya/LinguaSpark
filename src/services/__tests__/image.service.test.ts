import { describe, it, expect, vi, beforeEach } from 'vitest';
import { imageService } from '../image.service';
import { pollinationsService } from '../pollinations.service';

// Mock the pollinations service
vi.mock('../pollinations.service', () => ({
  pollinationsService: {
    generateImage: vi.fn(),
    checkApiStatus: vi.fn()
  }
}));

describe('ImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    imageService.clearCache();
  });

  describe('generateImage', () => {
    it('should generate image successfully', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      const result = await imageService.generateImage('simple dog icon');

      expect(result.imageUrl).toBe(mockResponse.imageUrl);
      expect(result.fromCache).toBe(false);
      expect(result.fallbackUsed).toBe(false);
      expect(result.quality).toBeDefined();
      expect(result.generationTime).toBeGreaterThan(0);
    });

    it('should return cached image on second request', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      // First request
      await imageService.generateImage('simple dog icon');
      
      // Second request should use cache
      const result = await imageService.generateImage('simple dog icon');

      expect(result.fromCache).toBe(true);
      expect(pollinationsService.generateImage).toHaveBeenCalledTimes(1);
    });

    it('should use fallback emoji when generation fails', async () => {
      vi.mocked(pollinationsService.generateImage).mockRejectedValue(new Error('API Error'));

      const result = await imageService.generateImage('simple dog icon', {}, '🐕');

      expect(result.imageUrl).toBe('🐕');
      expect(result.fallbackUsed).toBe(true);
      expect(result.quality).toBeDefined();
    });

    it('should use intelligent fallback when no emoji provided', async () => {
      vi.mocked(pollinationsService.generateImage).mockRejectedValue(new Error('API Error'));

      const result = await imageService.generateImage('simple dog icon');

      expect(result.fallbackUsed).toBe(true);
      expect(result.imageUrl).toBeTruthy(); // Should have some fallback
    });
  });

  describe('generateImages', () => {
    it('should generate multiple images with progress tracking', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      const prompts = [
        { prompt: 'dog icon', fallbackEmoji: '🐕' },
        { prompt: 'cat icon', fallbackEmoji: '🐱' },
        { prompt: 'bird icon', fallbackEmoji: '🐦' }
      ];

      const progressUpdates: Array<{ completed: number; total: number }> = [];
      const onProgress = (completed: number, total: number) => {
        progressUpdates.push({ completed, total });
      };

      const results = await imageService.generateImages(prompts, onProgress);

      expect(results).toHaveLength(3);
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1]).toEqual({ completed: 3, total: 3 });
    });

    it('should ensure consistency across images when requested', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      const prompts = [
        { prompt: 'dog' },
        { prompt: 'cat' }
      ];

      await imageService.generateImages(prompts, undefined, true);

      // Check that all calls included consistent styling
      const calls = vi.mocked(pollinationsService.generateImage).mock.calls;
      calls.forEach(call => {
        const prompt = call[0];
        expect(prompt).toContain('simple icon style');
        expect(prompt).toContain('minimalist design');
      });
    });
  });

  describe('prompt optimization', () => {
    it('should optimize prompts for zimage model', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      await imageService.generateImage('dog');

      const call = vi.mocked(pollinationsService.generateImage).mock.calls[0];
      const optimizedPrompt = call[0];

      expect(optimizedPrompt).toContain('simple icon style');
      expect(optimizedPrompt).toContain('minimalist design');
      expect(optimizedPrompt).toContain('clean white background');
      expect(optimizedPrompt).toContain('flat design');
    });

    it('should not duplicate style modifiers', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      await imageService.generateImage('dog, simple icon style, minimalist design');

      const call = vi.mocked(pollinationsService.generateImage).mock.calls[0];
      const optimizedPrompt = call[0];

      // Should not have duplicate style modifiers
      const styleCount = (optimizedPrompt.match(/simple icon style/g) || []).length;
      expect(styleCount).toBeLessThanOrEqual(1);
    });
  });

  describe('quality assessment', () => {
    it('should assess image quality correctly', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      const result = await imageService.generateImage('simple clean dog icon');

      expect(result.quality).toBeDefined();
      expect(result.quality!.consistency).toBeGreaterThan(0);
      expect(result.quality!.clarity).toBeGreaterThan(0);
      expect(result.quality!.appropriateness).toBeGreaterThan(0);
      expect(result.quality!.overall).toBeGreaterThan(0);
    });

    it('should give lower quality scores to emoji fallbacks', async () => {
      vi.mocked(pollinationsService.generateImage).mockRejectedValue(new Error('API Error'));

      const result = await imageService.generateImage('dog', {}, '🐕');

      expect(result.quality!.overall).toBeLessThan(80); // Emoji fallbacks should have lower scores
    });
  });

  describe('caching', () => {
    it('should cache generated images', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      // Generate image
      await imageService.generateImage('dog icon');

      // Check cache stats
      const stats = imageService.getCacheStats();
      expect(stats.size).toBe(1);
    });

    it('should clear cache when requested', async () => {
      const mockResponse = {
        imageUrl: 'data:image/png;base64,mockImageData',
        model: 'zimage',
        parameters: { width: 256, height: 256, seed: -1, enhance: false }
      };

      vi.mocked(pollinationsService.generateImage).mockResolvedValue(mockResponse);

      // Generate image
      await imageService.generateImage('dog icon');
      
      // Clear cache
      imageService.clearCache();

      // Check cache is empty
      const stats = imageService.getCacheStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('availability check', () => {
    it('should check API availability', async () => {
      vi.mocked(pollinationsService.checkApiStatus).mockResolvedValue(true);

      const isAvailable = await imageService.checkAvailability();

      expect(isAvailable).toBe(true);
      expect(pollinationsService.checkApiStatus).toHaveBeenCalled();
    });

    it('should handle availability check errors', async () => {
      vi.mocked(pollinationsService.checkApiStatus).mockRejectedValue(new Error('Network error'));

      const isAvailable = await imageService.checkAvailability();

      expect(isAvailable).toBe(false);
    });
  });
});