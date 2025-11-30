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
  // Generate TTS audio
  async generateAudio(
    text: string,
    voice: string = 'alloy',
    provider: 'pollinations' | 'groq' = 'pollinations'
  ): Promise<TTSResult> {
    const response = await api.post<TTSResult>('/tts/generate', {
      text,
      voice,
      provider,
    });
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to generate audio');
  },

  // Get TTS URL for direct playback
  async getAudioUrl(text: string, voice: string = 'alloy'): Promise<string> {
    const response = await api.get<{ audioUrl: string }>(
      `/tts/url?text=${encodeURIComponent(text)}&voice=${voice}`
    );
    if (response.data) {
      return response.data.audioUrl;
    }
    throw new Error(response.message || 'Failed to get audio URL');
  },

  // Get available voices
  async getVoices(): Promise<Voice[]> {
    const response = await api.get<{ voices: Voice[] }>('/tts/voices');
    if (response.data) {
      return response.data.voices;
    }
    throw new Error(response.message || 'Failed to get voices');
  },

  // Simple URL generation for client-side (no API call needed)
  // Correct Pollinations TTS URL format: https://text.pollinations.ai/{prompt}?model=openai-audio&voice={voice}
  getDirectTTSUrl(text: string, voice: string = 'alloy'): string {
    const encodedText = encodeURIComponent(text.substring(0, 500));
    return `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
  },

  // Play audio helper
  playAudio(audioSource: string): HTMLAudioElement {
    const audio = new Audio(audioSource);
    audio.play().catch(console.error);
    return audio;
  },
};

export default ttsService;
