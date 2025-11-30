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
// Uses their text-to-speech API: GET https://text.pollinations.ai/{prompt}?model=openai-audio&voice={voice}
async function pollinationsTTS(text: string, voice: string = 'alloy'): Promise<TTSResult> {
  try {
    // Pollinations TTS endpoint format: GET https://text.pollinations.ai/{prompt}?model=openai-audio&voice={voice}
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;

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

// Alternative Pollinations approach - fetch audio directly and return as base64
async function pollinationsOpenAITTS(text: string, voice: string = 'alloy'): Promise<TTSResult> {
  try {
    // Pollinations TTS endpoint: GET https://text.pollinations.ai/{prompt}?model=openai-audio&voice={voice}
    const encodedText = encodeURIComponent(text);
    const url = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
    
    const response = await fetch(url);

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

// Groq TTS API endpoint and model
const GROQ_TTS_URL = 'https://api.groq.com/openai/v1/audio/speech';
const GROQ_TTS_MODEL = 'playai-tts';

// Map common voice names to Groq PlayAI voices
const GROQ_VOICE_MAP: Record<string, string> = {
  'alloy': 'Fritz-PlayAI',
  'echo': 'Atlas-PlayAI',
  'fable': 'Calum-PlayAI',
  'onyx': 'Briggs-PlayAI',
  'nova': 'Celeste-PlayAI',
  'shimmer': 'Arista-PlayAI',
  'default': 'Fritz-PlayAI',
};

// Groq TTS using playai-tts model
async function groqTTS(text: string, voice: string = 'default'): Promise<TTSResult> {
  try {
    const groqApiKey = config.groq?.apiKey;

    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Map voice to Groq PlayAI voice
    const groqVoice = GROQ_VOICE_MAP[voice] || GROQ_VOICE_MAP['default'];

    const response = await fetch(GROQ_TTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_TTS_MODEL,
        input: text,
        voice: groqVoice,
        response_format: 'wav',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as any;
      throw new Error(errorData?.error?.message || `Groq TTS error: ${response.status}`);
    }

    // Get audio as base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    return {
      audioBase64: `data:audio/wav;base64,${base64Audio}`,
      provider: 'groq',
    };
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
  // Correct Pollinations TTS URL format
  return `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
}

// Available voices (compatible with both Pollinations and Groq)
export const availableVoices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced', groqVoice: 'Fritz-PlayAI' },
  { id: 'echo', name: 'Echo', description: 'Warm and friendly', groqVoice: 'Atlas-PlayAI' },
  { id: 'fable', name: 'Fable', description: 'Expressive storyteller', groqVoice: 'Calum-PlayAI' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative', groqVoice: 'Briggs-PlayAI' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic', groqVoice: 'Celeste-PlayAI' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle', groqVoice: 'Arista-PlayAI' },
];

// Groq-specific voices (PlayAI)
export const groqVoices = [
  { id: 'Fritz-PlayAI', name: 'Fritz', description: 'Clear male voice' },
  { id: 'Arista-PlayAI', name: 'Arista', description: 'Soft female voice' },
  { id: 'Atlas-PlayAI', name: 'Atlas', description: 'Warm male voice' },
  { id: 'Basil-PlayAI', name: 'Basil', description: 'British male voice' },
  { id: 'Briggs-PlayAI', name: 'Briggs', description: 'Deep male voice' },
  { id: 'Calum-PlayAI', name: 'Calum', description: 'Scottish male voice' },
  { id: 'Celeste-PlayAI', name: 'Celeste', description: 'Bright female voice' },
  { id: 'Cheyenne-PlayAI', name: 'Cheyenne', description: 'American female voice' },
  { id: 'Chip-PlayAI', name: 'Chip', description: 'Youthful male voice' },
  { id: 'Cillian-PlayAI', name: 'Cillian', description: 'Irish male voice' },
  { id: 'Deedee-PlayAI', name: 'Deedee', description: 'Energetic female voice' },
  { id: 'Gail-PlayAI', name: 'Gail', description: 'Mature female voice' },
  { id: 'Indigo-PlayAI', name: 'Indigo', description: 'Calm voice' },
  { id: 'Mamaw-PlayAI', name: 'Mamaw', description: 'Southern female voice' },
  { id: 'Mason-PlayAI', name: 'Mason', description: 'Friendly male voice' },
  { id: 'Mikail-PlayAI', name: 'Mikail', description: 'Eastern European male voice' },
  { id: 'Mitch-PlayAI', name: 'Mitch', description: 'Casual male voice' },
  { id: 'Quinn-PlayAI', name: 'Quinn', description: 'Neutral voice' },
  { id: 'Thunder-PlayAI', name: 'Thunder', description: 'Powerful male voice' },
];

export default {
  generateTTS,
  getTTSUrl,
  availableVoices,
  groqVoices,
};
