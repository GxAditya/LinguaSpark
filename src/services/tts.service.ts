import api from './api';

export interface Voice {
  id: string;
  name: string;
  description: string;
}

export interface TTSResult {
  audioUrl?: string;
  audioBase64?: string;
  provider: string;
}

export const ttsService = {
  // Generate TTS audio using Groq only
  async generateAudio(
    text: string,
    voice: string = 'alloy'
  ): Promise<TTSResult> {
    const response = await api.post<TTSResult>('/tts/generate', {
      text,
      voice,
      provider: 'groq',
    });
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to generate audio');
  },

  // Get available voices
  async getVoices(): Promise<Voice[]> {
    const response = await api.get<{ voices: Voice[] }>('/tts/voices');
    if (response.data) {
      return response.data.voices;
    }
    throw new Error(response.message || 'Failed to get voices');
  },

  // Play audio helper
  playAudio(audioSource: string): HTMLAudioElement {
    const audio = new Audio(audioSource);
    audio.play().catch(console.error);
    return audio;
  },
};

export default ttsService;
