import config from '../config/index.js';

export type TTSProvider = 'groq';

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

// Groq TTS API endpoint and model
const GROQ_TTS_URL = 'https://api.groq.com/openai/v1/audio/speech';
const GROQ_TTS_MODEL = 'canopylabs/orpheus-v1-english';

// Map common voice names to Groq Orpheus voices
const GROQ_VOICE_MAP: Record<string, string> = {
  'alloy': 'autumn',
  'echo': 'daniel',
  'fable': 'austin',
  'onyx': 'troy',
  'nova': 'diana',
  'shimmer': 'hannah',
  'default': 'autumn',
};

// Groq TTS using Orpheus model
async function groqTTS(text: string, voice: string = 'default'): Promise<TTSResult> {
  try {
    const groqApiKey = config.groq?.apiKey;

    if (!groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Map voice to Groq Orpheus voice
    const orpheusVoice = GROQ_VOICE_MAP[voice] || GROQ_VOICE_MAP['default'];
    
    // Format text with voice name as required by Orpheus model
    const formattedText = `${orpheusVoice}: ${text}`;

    const response = await fetch(GROQ_TTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_TTS_MODEL,
        input: formattedText,
        voice: orpheusVoice,
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

// Main TTS function that uses Groq only
export async function generateTTS(options: TTSOptions): Promise<TTSResult> {
  const { text, voice = 'alloy', provider = 'groq' } = options;

  if (!text || text.trim().length === 0) {
    return {
      provider: 'groq',
      error: 'Text is required for TTS',
    };
  }

  // Limit text length for TTS
  const maxLength = 1000;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  try {
    return await groqTTS(truncatedText, voice);
  } catch (error) {
    console.error('TTS generation error:', error);
    return {
      provider: 'groq',
      error: error instanceof Error ? error.message : 'TTS generation failed',
    };
  }
}

// Available voices (Groq Orpheus voices mapped to common names)
export const availableVoices = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced (Autumn)', groqVoice: 'autumn' },
  { id: 'echo', name: 'Echo', description: 'Warm and friendly (Daniel)', groqVoice: 'daniel' },
  { id: 'fable', name: 'Fable', description: 'Expressive storyteller (Austin)', groqVoice: 'austin' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative (Troy)', groqVoice: 'troy' },
  { id: 'nova', name: 'Nova', description: 'Bright and energetic (Diana)', groqVoice: 'diana' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle (Hannah)', groqVoice: 'hannah' },
];

// Groq-specific voices (Orpheus)
export const groqVoices = [
  { id: 'autumn', name: 'Autumn', description: 'Clear female voice' },
  { id: 'diana', name: 'Diana', description: 'Energetic female voice' },
  { id: 'hannah', name: 'Hannah', description: 'Soft female voice' },
  { id: 'austin', name: 'Austin', description: 'Expressive male voice' },
  { id: 'daniel', name: 'Daniel', description: 'Warm male voice' },
  { id: 'troy', name: 'Troy', description: 'Deep male voice' },
];

export default {
  generateTTS,
  availableVoices,
  groqVoices,
};
