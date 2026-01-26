import config from '../config/index.js';
import { PollinationsAuth, ApiError, ApiErrorType } from './pollinations.auth.service.js';

export interface TextGenerationOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  seed?: number;
}

export interface ImageGenerationOptions {
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  enhance?: boolean;
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

/**
 * Pollinations API Service
 * Handles authenticated requests to the new Pollinations API
 */
export class PollinationsApiService {
  private auth: PollinationsAuth;
  private baseUrl: string;
  private timeout: number;

  constructor(auth?: PollinationsAuth) {
    this.auth = auth || new PollinationsAuth();
    this.baseUrl = config.pollinations.baseUrl;
    this.timeout = 30000; // 30 seconds timeout
  }

  /**
   * Make authenticated request to Pollinations API
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise with response data
   */
  private async authenticatedRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.auth.getAuthHeaders(),
        ...options.headers
      },
      signal: AbortSignal.timeout(this.timeout)
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw {
          status: response.status,
          message: errorData?.error?.message || errorData?.message || response.statusText,
          ...errorData
        };
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        return await response.json() as T;
      } else if (contentType?.includes('image/')) {
        // For image responses, return as blob
        const blob = await response.blob();
        return blob as unknown as T;
      } else {
        // For other content types, return as text
        const text = await response.text();
        return text as unknown as T;
      }
    } catch (error: any) {
      // Handle timeout errors
      if (error.name === 'TimeoutError') {
        throw {
          type: ApiErrorType.NETWORK,
          message: 'Request timeout. The API is taking too long to respond.',
          retryable: true
        };
      }

      // Handle abort errors
      if (error.name === 'AbortError') {
        throw {
          type: ApiErrorType.NETWORK,
          message: 'Request was aborted.',
          retryable: false
        };
      }

      // Re-throw API errors as-is
      if (error.type) {
        throw error;
      }

      // Convert other errors using auth error handler
      throw this.auth.handleAuthError(error);
    }
  }

  /**
   * Generate text using nova-fast model
   * @param prompt - Text prompt
   * @param options - Generation options
   * @returns Promise with generated text
   */
  async generateText(prompt: string, options: TextGenerationOptions = {}): Promise<TextResponse> {
    const {
      model = config.pollinations.textModel,
      temperature = 0.7,
      max_tokens = 2000,
      seed
    } = options;

    const messages = [
      { role: 'user', content: prompt }
    ];

    const requestBody: any = {
      model,
      messages,
      temperature,
      max_tokens
    };

    if (seed !== undefined) {
      requestBody.seed = seed;
    }

    const response = await this.authenticatedRequest<any>('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    return {
      content: response.choices[0].message.content,
      model: response.model,
      usage: response.usage
    };
  }

  /**
   * Generate image using zimage model
   * @param prompt - Image prompt
   * @param options - Generation options
   * @returns Promise with image data
   */
  async generateImage(prompt: string, options: ImageGenerationOptions = {}): Promise<ImageResponse> {
    const {
      model = config.pollinations.imageModel,
      width = 256,
      height = 256,
      seed = -1,
      enhance = false
    } = options;

    // Build query parameters
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      enhance: enhance.toString()
    });

    const endpoint = `/image/${encodeURIComponent(prompt)}?${params}`;
    
    const blob = await this.authenticatedRequest<Blob>(endpoint, {
      method: 'GET'
    });

    // Convert blob to data URL
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = blob.type || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64}`;

    return {
      imageUrl,
      model,
      parameters: { model, width, height, seed, enhance }
    };
  }

  /**
   * Validate API connection and authentication
   * @returns Promise<boolean> - true if connection is valid
   */
  async validateConnection(): Promise<boolean> {
    try {
      return await this.auth.validateApiKey();
    } catch (error) {
      console.error('Connection validation failed:', error);
      return false;
    }
  }

  /**
   * Generate text with retry logic
   * @param prompt - Text prompt
   * @param options - Generation options
   * @returns Promise with generated text
   */
  async generateTextWithRetry(prompt: string, options: TextGenerationOptions = {}): Promise<TextResponse> {
    return this.auth.retryWithBackoff(() => this.generateText(prompt, options));
  }

  /**
   * Generate image with retry logic
   * @param prompt - Image prompt
   * @param options - Generation options
   * @returns Promise with image data
   */
  async generateImageWithRetry(prompt: string, options: ImageGenerationOptions = {}): Promise<ImageResponse> {
    return this.auth.retryWithBackoff(() => this.generateImage(prompt, options));
  }
}

// Export singleton instance
export const pollinationsApi = new PollinationsApiService();

export default PollinationsApiService;