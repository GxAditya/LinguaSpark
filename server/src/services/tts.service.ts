import config from '../config/index.js';

export type TTSProvider = 'pollinations' | 'groq';

interface TTSOptions {
  text: string;
  language?: string;
  voice?: string;
  provider?: TTSProvider;
}

interface TTSResult {
  audioUrl?: string;
  audioBase64?: string;
  provider: TTSProvider;
  error?: string;
}

// Pollinations TTS - Free, no API key required
// Uses their text-to-speech API
async function pollinationsTTS(text: string, voice: string = 'alloy'): Promise<TTSResult> {
  try {
    // Pollinations provides a simple TTS endpoint
    // The audio is generated and returned as a URL
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://text.pollinations.ai/audio?text=${encodedText}&voice=${voice}`;

    // Verify the URL works by making a HEAD request
    const response = await fetch(audioUrl, { method: 'HEAD' });

    if (!response.ok) {
      throw new Error('Pollinations TTS unavailable');
    }

    return {
      audioUrl,
      provider: 'pollinations',
    };
  } catch (error) {
    console.error('Pollinations TTS error:', error);
    return {
      provider: 'pollinations',
      error: error instanceof Error ? error.message : 'Pollinations TTS failed',
    };
  }
}

// Alternative Pollinations approach using their OpenAI-compatible endpoint
async function pollinationsOpenAITTS(text: string, voice: string = 'alloy'): Promise<TTSResult> {
  try {
    const response = await fetch('https://text.pollinations.ai/openai/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice, // alloy, echo, fable, onyx, nova, shimmer
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations TTS error: ${response.status}`);
    }

    // Get audio as base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return {
      audioBase64: `data:audio/mp3;base64,${base64Audio}`,
      provider: 'pollinations',
    };
  } catch (error) {
    console.error('Pollinations OpenAI TTS error:', error);
    return {
      provider: 'pollinations',
      error: error instanceof Error ? error.message : 'Pollinations TTS failed',
    };
  }
}

// Groq TTS using Whisper (actually STT, but we can use their LLM for TTS-like features)
// Note: Groq doesn't have direct TTS, so we'll use Pollinations as primary
// This is a placeholder for when Groq adds TTS support
async function groqTTS(text: string, _voice: string = 'default'): Promise<TTSResult> {
  try {
    const groqApiKey = config.groq?.apiKey;

    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Groq currently doesn't have a TTS API
    // We could potentially use their LLM to generate phonetic representations
    // For now, fall back to Pollinations
    console.log('Groq TTS not available, falling back to Pollinations');
    return pollinationsOpenAITTS(text);
  } catch (error) {
    console.error('Groq TTS error:', error);
    return {
      provider: 'groq',
      error: error instanceof Error ? error.message : 'Groq TTS failed',
    };
  }
}

// Main TTS function that tries providers in order
export async function generateTTS(options: TTSOptions): Promise<TTSResult> {
  const { text, voice = 'alloy', provider = 'pollinations' } = options;

  if (!text || text.trim().length === 0) {
    return {
      provider,
      error: 'Text is required for TTS',
    };
  }

  // Limit text length for TTS
  const maxLength = 1000;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  try {
    switch (provider) {
      case 'groq':
        return await groqTTS(truncatedText, voice);
      case 'pollinations':
      default: {
        // Try the OpenAI-compatible endpoint first
        const result = await pollinationsOpenAITTS(truncatedText, voice);
        if (result.error) {
          // Fall back to simple URL-based TTS
          return await pollinationsTTS(truncatedText, voice);
        }
        return result;
      }
    }
  } catch (error) {
    console.error('TTS generation error:', error);
    return {
      provider,
      error: error instanceof Error ? error.message : 'TTS generation failed',
    };
  }
}

// Generate TTS URL for client-side playback (simpler approach)
export function getTTSUrl(text: string, voice: string = 'alloy'): string {
  const encodedText = encodeURIComponent(text.substring(0, 500)); // Limit length
  return `https://text.pollinations.ai/audio?text=${encodedText}&voice=${voice}`;
}

// Available voices
export const availableVoices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Warm and friendly' },
  { id: 'fable', name: 'Fable', description: 'Expressive storyteller' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
];

export default {
  generateTTS,
  getTTSUrl,
  availableVoices,
};
