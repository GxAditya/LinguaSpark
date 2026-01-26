import api from './api.js';

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
}

/**
 * Client-side Pollinations Service
 * Communicates with the server-side Pollinations API service
 */
class PollinationsService {
  /**
   * Generate text content using the server-side Pollinations API
   */
  async generateText(prompt: string, options: TextGenerationOptions = {}): Promise<TextResponse> {
    try {
      const response = await api.post<TextResponse>('/pollinations/text', {
        prompt,
        options
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Text generation failed');
      }

      return response.data;
    } catch (error: any) {
      console.error('Text generation error:', error);
      throw new Error(error.message || 'Failed to generate text content');
    }
  }

  /**
   * Generate image using the server-side Pollinations API
   */
  async generateImage(prompt: string, options: ImageGenerationOptions = {}): Promise<ImageResponse> {
    try {
      const response = await api.post<ImageResponse>('/pollinations/image', {
        prompt,
        options
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Image generation failed');
      }

      return response.data;
    } catch (error: any) {
      console.error('Image generation error:', error);
      throw new Error(error.message || 'Failed to generate image');
    }
  }

  /**
   * Generate game content using optimized prompts
   */
  async generateGameContent(options: GameContentOptions): Promise<GameContent> {
    try {
      const response = await api.post<GameContent>('/pollinations/game-content', options);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Game content generation failed');
      }

      return response.data;
    } catch (error: any) {
      console.error('Game content generation error:', error);
      throw new Error(error.message || 'Failed to generate game content');
    }
  }

  /**
   * Check if Pollinations API is available
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      const response = await api.get<{ available: boolean }>('/pollinations/status');
      return response.success && response.data?.available === true;
    } catch (error) {
      console.error('API status check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const pollinationsService = new PollinationsService();

export default PollinationsService;