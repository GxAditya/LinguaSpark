import { describe, it, expect, beforeEach } from 'vitest';
import { FallbackContentService } from '../fallback-content.service.js';

describe('FallbackContentService', () => {
  let service: FallbackContentService;

  beforeEach(() => {
    service = FallbackContentService.getInstance();
    service.clearCache();
  });

  describe('Content Generation', () => {
    it('should generate fallback content for supported game types', () => {
      const options = {
        gameType: 'translation-match-up',
        difficulty: 'beginner' as const,
        language: 'en',
        targetLanguage: 'es'
      };

      const content = service.getFallbackContent(options, 'API_FAILURE');

      expect(content).toBeDefined();
      expect(content?.type).toBe('translation-match-up');
      expect(content?.difficulty).toBe('beginner');
      expect(content?.language).toBe('en');
      expect(content?.targetLanguage).toBe('es');
      expect(content?.rounds).toHaveLength(5);
      expect(content?.metadata.isFallback).toBe(true);
      expect(content?.metadata.reason).toBe('API_FAILURE');
    });

    it('should return null for unsupported game types', () => {
      const options = {
        gameType: 'unsupported-game',
        difficulty: 'beginner' as const,
        language: 'en',
        targetLanguage: 'es'
      };

      const content = service.getFallbackContent(options, 'API_FAILURE');
      expect(content).toBeNull();
    });

    it('should return null for unsupported language pairs', () => {
      const options = {
        gameType: 'translation-match-up',
        difficulty: 'beginner' as const,
        language: 'en',
        targetLanguage: 'zh' // Not supported
      };

      const content = service.getFallbackContent(options, 'API_FAILURE');
      expect(content).toBeNull();
    });

    it('should cache generated content', () => {
      const options = {
        gameType: 'translation-match-up',
        difficulty: 'beginner' as const,
        language: 'en',
        targetLanguage: 'es'
      };

      const content1 = service.getFallbackContent(options, 'API_FAILURE');
      const content2 = service.getFallbackContent(options, 'RATE_LIMIT');

      expect(content1).toBeDefined();
      expect(content2).toBeDefined();
      expect(content1?.rounds).toEqual(content2?.rounds);
      expect(content2?.metadata.reason).toBe('RATE_LIMIT'); // Should update reason
    });
  });

  describe('Availability Checks', () => {
    it('should correctly identify available content', () => {
      const hasContent = service.hasFallbackContent({
        gameType: 'translation-match-up',
        difficulty: 'beginner',
        language: 'en',
        targetLanguage: 'es'
      });

      expect(hasContent).toBe(true);
    });

    it('should correctly identify unavailable content', () => {
      const hasContent = service.hasFallbackContent({
        gameType: 'unsupported-game',
        difficulty: 'beginner',
        language: 'en',
        targetLanguage: 'es'
      });

      expect(hasContent).toBe(false);
    });
  });

  describe('Content Discovery', () => {
    it('should return supported game types', () => {
      const gameTypes = service.getSupportedGameTypes();

      expect(gameTypes).toContain('translation-match-up');
      expect(gameTypes).toContain('conjugation-coach');
      expect(gameTypes).toContain('audio-jumble');
    });

    it('should return available language pairs for a game type', () => {
      const languagePairs = service.getAvailableLanguagePairs('translation-match-up', 'beginner');

      expect(languagePairs).toContain('en-es');
      expect(languagePairs).toContain('en-fr');
    });

    it('should return available difficulties for a game type', () => {
      const difficulties = service.getAvailableDifficulties('translation-match-up');

      expect(difficulties).toContain('beginner');
      expect(difficulties).toContain('intermediate');
    });
  });

  describe('Statistics', () => {
    it('should provide accurate statistics', () => {
      const stats = service.getStatistics();

      expect(stats.totalGameTypes).toBeGreaterThan(0);
      expect(stats.totalLanguagePairs).toBeGreaterThan(0);
      expect(stats.supportedCombinations).toBeInstanceOf(Array);
      expect(stats.supportedCombinations.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Templates', () => {
    it('should allow adding custom templates', () => {
      const customTemplate = {
        rounds: [
          { word: 'test', translation: 'prueba', options: ['prueba', 'examen', 'ensayo', 'test'] }
        ],
        instructions: 'Custom test instructions'
      };

      service.addCustomTemplate('custom-game', 'beginner', 'en-es', customTemplate);

      const content = service.getFallbackContent({
        gameType: 'custom-game',
        difficulty: 'beginner',
        language: 'en',
        targetLanguage: 'es'
      }, 'TEST');

      expect(content).toBeDefined();
      expect(content?.rounds).toEqual(customTemplate.rounds);
      expect(content?.instructions).toBe(customTemplate.instructions);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache when requested', () => {
      const options = {
        gameType: 'translation-match-up',
        difficulty: 'beginner' as const,
        language: 'en',
        targetLanguage: 'es'
      };

      // Generate content to populate cache
      service.getFallbackContent(options, 'API_FAILURE');

      // Clear cache
      service.clearCache();

      // Generate again - should work fine
      const content = service.getFallbackContent(options, 'API_FAILURE');
      expect(content).toBeDefined();
    });
  });
});