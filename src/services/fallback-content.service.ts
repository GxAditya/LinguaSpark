/**
 * Fallback Content Service
 * Provides backup content when API calls fail
 */

export interface FallbackGameContent {
  type: string;
  difficulty: string;
  language: string;
  targetLanguage: string;
  rounds: any[];
  instructions?: string;
  metadata: {
    isFallback: true;
    generatedAt: string;
    reason: string;
  };
}

export interface FallbackContentOptions {
  gameType: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  targetLanguage: string;
  topic?: string;
}

/**
 * Fallback content templates for different game types
 */
const FALLBACK_CONTENT_TEMPLATES = {
  'translation-match-up': {
    beginner: {
      'en-es': {
        rounds: [
          { word: 'hello', translation: 'hola', options: ['hola', 'adiós', 'gracias', 'por favor'] },
          { word: 'goodbye', translation: 'adiós', options: ['adiós', 'hola', 'sí', 'no'] },
          { word: 'thank you', translation: 'gracias', options: ['gracias', 'de nada', 'perdón', 'hola'] },
          { word: 'please', translation: 'por favor', options: ['por favor', 'gracias', 'adiós', 'hola'] },
          { word: 'yes', translation: 'sí', options: ['sí', 'no', 'tal vez', 'nunca'] }
        ],
        instructions: 'Match each English word with its Spanish translation.'
      },
      'en-fr': {
        rounds: [
          { word: 'hello', translation: 'bonjour', options: ['bonjour', 'au revoir', 'merci', 's\'il vous plaît'] },
          { word: 'goodbye', translation: 'au revoir', options: ['au revoir', 'bonjour', 'oui', 'non'] },
          { word: 'thank you', translation: 'merci', options: ['merci', 'de rien', 'pardon', 'bonjour'] },
          { word: 'please', translation: 's\'il vous plaît', options: ['s\'il vous plaît', 'merci', 'au revoir', 'bonjour'] },
          { word: 'yes', translation: 'oui', options: ['oui', 'non', 'peut-être', 'jamais'] }
        ],
        instructions: 'Match each English word with its French translation.'
      }
    },
    intermediate: {
      'en-es': {
        rounds: [
          { word: 'beautiful', translation: 'hermoso', options: ['hermoso', 'feo', 'grande', 'pequeño'] },
          { word: 'important', translation: 'importante', options: ['importante', 'fácil', 'difícil', 'nuevo'] },
          { word: 'family', translation: 'familia', options: ['familia', 'amigo', 'casa', 'trabajo'] },
          { word: 'school', translation: 'escuela', options: ['escuela', 'hospital', 'tienda', 'parque'] },
          { word: 'happy', translation: 'feliz', options: ['feliz', 'triste', 'enojado', 'cansado'] }
        ],
        instructions: 'Match each English word with its Spanish translation.'
      }
    }
  },
  'conjugation-coach': {
    beginner: {
      'en-es': {
        rounds: [
          { verb: 'ser', pronoun: 'yo', correct: 'soy', options: ['soy', 'eres', 'es', 'somos'] },
          { verb: 'ser', pronoun: 'tú', correct: 'eres', options: ['eres', 'soy', 'es', 'son'] },
          { verb: 'tener', pronoun: 'yo', correct: 'tengo', options: ['tengo', 'tienes', 'tiene', 'tenemos'] },
          { verb: 'tener', pronoun: 'él', correct: 'tiene', options: ['tiene', 'tengo', 'tienes', 'tienen'] },
          { verb: 'hacer', pronoun: 'yo', correct: 'hago', options: ['hago', 'haces', 'hace', 'hacemos'] }
        ],
        instructions: 'Choose the correct conjugation for each verb and pronoun combination.'
      }
    }
  },
  'word-drop-dash': {
    beginner: {
      'en-es': {
        rounds: [
          {
            sentence: 'Me gusta la ___',
            correctWord: 'pizza',
            options: ['pizza', 'libro', 'agua', 'música'],
            translation: 'I like ___'
          },
          {
            sentence: 'El ___ es azul',
            correctWord: 'cielo',
            options: ['cielo', 'casa', 'perro', 'coche'],
            translation: 'The ___ is blue'
          },
          {
            sentence: 'Voy a la ___',
            correctWord: 'escuela',
            options: ['escuela', 'playa', 'tienda', 'casa'],
            translation: 'I go to ___'
          }
        ],
        instructions: 'Complete each sentence by choosing the correct word.'
      }
    }
  },

  'audio-jumble': {
    beginner: {
      'en-es': {
        rounds: [
          {
            word: 'hola',
            scrambled: ['a', 'l', 'o', 'h'],
            translation: 'hello',
            audioText: 'hola'
          },
          {
            word: 'gracias',
            scrambled: ['s', 'a', 'i', 'c', 'a', 'r', 'g'],
            translation: 'thank you',
            audioText: 'gracias'
          },
          {
            word: 'amigo',
            scrambled: ['o', 'g', 'i', 'm', 'a'],
            translation: 'friend',
            audioText: 'amigo'
          }
        ],
        instructions: 'Listen to the word and unscramble the letters to spell it correctly.'
      }
    }
  }
};

/**
 * Fallback Content Manager
 */
export class FallbackContentService {
  private static instance: FallbackContentService;
  private contentCache = new Map<string, FallbackGameContent>();

  private constructor() { }

  static getInstance(): FallbackContentService {
    if (!FallbackContentService.instance) {
      FallbackContentService.instance = new FallbackContentService();
    }
    return FallbackContentService.instance;
  }

  /**
   * Get fallback content for a specific game configuration
   */
  getFallbackContent(options: FallbackContentOptions, reason: string = 'API_FAILURE'): FallbackGameContent | null {
    const cacheKey = this.generateCacheKey(options);

    // Check cache first
    if (this.contentCache.has(cacheKey)) {
      const cached = this.contentCache.get(cacheKey)!;
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          reason
        }
      };
    }

    // Generate fallback content
    const content = this.generateFallbackContent(options, reason);

    if (content) {
      this.contentCache.set(cacheKey, content);
    }

    return content;
  }

  /**
   * Generate fallback content based on templates
   */
  private generateFallbackContent(options: FallbackContentOptions, reason: string): FallbackGameContent | null {
    const { gameType, difficulty, language, targetLanguage } = options;

    // Get template for game type
    const gameTemplate = FALLBACK_CONTENT_TEMPLATES[gameType as keyof typeof FALLBACK_CONTENT_TEMPLATES];
    if (!gameTemplate) {
      console.warn(`No fallback template available for game type: ${gameType}`);
      return null;
    }

    // Get difficulty level
    const difficultyTemplate = gameTemplate[difficulty as keyof typeof gameTemplate];
    if (!difficultyTemplate) {
      console.warn(`No fallback template available for difficulty: ${difficulty} in game: ${gameType}`);
      return null;
    }

    // Get language pair
    const languagePair = `${language}-${targetLanguage}`;
    const languageTemplate = difficultyTemplate[languagePair as keyof typeof difficultyTemplate];
    if (!languageTemplate) {
      console.warn(`No fallback template available for language pair: ${languagePair} in game: ${gameType}`);
      return null;
    }

    return {
      type: gameType,
      difficulty,
      language,
      targetLanguage,
      rounds: languageTemplate.rounds,
      instructions: languageTemplate.instructions,
      metadata: {
        isFallback: true,
        generatedAt: new Date().toISOString(),
        reason
      }
    };
  }

  /**
   * Check if fallback content is available for given options
   */
  hasFallbackContent(options: FallbackContentOptions): boolean {
    const { gameType, difficulty, language, targetLanguage } = options;

    const gameTemplate = FALLBACK_CONTENT_TEMPLATES[gameType as keyof typeof FALLBACK_CONTENT_TEMPLATES];
    if (!gameTemplate) return false;

    const difficultyTemplate = gameTemplate[difficulty as keyof typeof gameTemplate];
    if (!difficultyTemplate) return false;

    const languagePair = `${language}-${targetLanguage}`;
    const languageTemplate = difficultyTemplate[languagePair as keyof typeof difficultyTemplate];

    return !!languageTemplate;
  }

  /**
   * Get available language pairs for a game type and difficulty
   */
  getAvailableLanguagePairs(gameType: string, difficulty: string): string[] {
    const gameTemplate = FALLBACK_CONTENT_TEMPLATES[gameType as keyof typeof FALLBACK_CONTENT_TEMPLATES];
    if (!gameTemplate) return [];

    const difficultyTemplate = gameTemplate[difficulty as keyof typeof gameTemplate];
    if (!difficultyTemplate) return [];

    return Object.keys(difficultyTemplate);
  }

  /**
   * Get available difficulties for a game type
   */
  getAvailableDifficulties(gameType: string): string[] {
    const gameTemplate = FALLBACK_CONTENT_TEMPLATES[gameType as keyof typeof FALLBACK_CONTENT_TEMPLATES];
    if (!gameTemplate) return [];

    return Object.keys(gameTemplate);
  }

  /**
   * Get all supported game types with fallback content
   */
  getSupportedGameTypes(): string[] {
    return Object.keys(FALLBACK_CONTENT_TEMPLATES);
  }

  /**
   * Clear fallback content cache
   */
  clearCache(): void {
    this.contentCache.clear();
  }

  /**
   * Generate cache key for content options
   */
  private generateCacheKey(options: FallbackContentOptions): string {
    return `${options.gameType}-${options.difficulty}-${options.language}-${options.targetLanguage}-${options.topic || 'default'}`;
  }

  /**
   * Add custom fallback content template
   */
  addCustomTemplate(
    gameType: string,
    difficulty: string,
    languagePair: string,
    template: { rounds: any[]; instructions: string }
  ): void {
    const templates = FALLBACK_CONTENT_TEMPLATES as any;
    if (!templates[gameType]) {
      templates[gameType] = {};
    }

    if (!templates[gameType][difficulty]) {
      templates[gameType][difficulty] = {};
    }

    templates[gameType][difficulty][languagePair] = template;
  }

  /**
   * Get fallback content statistics
   */
  getStatistics(): {
    totalGameTypes: number;
    totalLanguagePairs: number;
    cacheSize: number;
    supportedCombinations: Array<{
      gameType: string;
      difficulty: string;
      languagePair: string;
    }>;
  } {
    const supportedCombinations: Array<{
      gameType: string;
      difficulty: string;
      languagePair: string;
    }> = [];

    let totalLanguagePairs = 0;

    Object.keys(FALLBACK_CONTENT_TEMPLATES).forEach(gameType => {
      const gameTemplate = FALLBACK_CONTENT_TEMPLATES[gameType as keyof typeof FALLBACK_CONTENT_TEMPLATES];
      Object.keys(gameTemplate).forEach(difficulty => {
        const difficultyTemplate = gameTemplate[difficulty as keyof typeof gameTemplate];
        Object.keys(difficultyTemplate).forEach(languagePair => {
          supportedCombinations.push({
            gameType,
            difficulty,
            languagePair
          });
          totalLanguagePairs++;
        });
      });
    });

    return {
      totalGameTypes: Object.keys(FALLBACK_CONTENT_TEMPLATES).length,
      totalLanguagePairs,
      cacheSize: this.contentCache.size,
      supportedCombinations
    };
  }
}

// Export singleton instance
export const fallbackContentService = FallbackContentService.getInstance();

export default FallbackContentService;