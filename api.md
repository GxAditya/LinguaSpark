# Pollinations AI API Documentation

## Overview
This document contains the updated Pollinations API integration for LinguaSpark, migrated from the old free endpoints to the new authenticated API at `gen.pollinations.ai`.

## Authentication
All API requests require authentication using a Bearer token:
```bash
Authorization: Bearer YOUR_API_KEY
```

Get your API key at: https://enter.pollinations.ai

## Base URL
```
https://gen.pollinations.ai
```

## Text Generation API

### Endpoint: `/v1/chat/completions`
OpenAI-compatible chat completions endpoint for text generation.

**Method:** POST

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "model": "nova-fast",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user", 
      "content": "Generate a Spanish conjugation exercise."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Available Text Models:**
- `nova-fast` (default) - Optimal speed and quality balance
- `openai` - Standard OpenAI model
- `openai-fast` - Faster OpenAI variant
- `claude-fast` - Fast Claude model
- `gemini-fast` - Fast Gemini model

**Response:**
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "nova-fast",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Generated content here..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 56,
    "completion_tokens": 31,
    "total_tokens": 87
  }
}
```

## Image Generation API

### Endpoint: `/image/{prompt}`
Generate images from text prompts.

**Method:** GET

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**URL Parameters:**
- `prompt` (required) - Text description of the image
- `model` - Image model (default: `zimage`)
- `width` - Image width in pixels (default: 1024)
- `height` - Image height in pixels (default: 1024)
- `seed` - Random seed for reproducible results (default: 0, use -1 for random)
- `enhance` - Let AI improve your prompt (default: false)

**Available Image Models:**
- `zimage` (default) - Consistent visual quality
- `flux` - High-quality image generation
- `turbo` - Fast image generation
- `gptimage` - GPT-based image generation

**Example Request:**
```bash
curl 'https://gen.pollinations.ai/image/simple%20icon%20of%20dog?model=zimage&width=256&height=256&seed=1' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

**Response:** Binary image data (JPEG/PNG)

## Simple Text Endpoint

### Endpoint: `/text/{prompt}`
Simple text generation endpoint.

**Method:** GET

**Parameters:**
- `prompt` (required) - Text prompt
- `model` - Text model (default: `nova-fast`)
- `temperature` - Creativity control (0.0-2.0)
- `seed` - Random seed

**Example:**
```bash
curl 'https://gen.pollinations.ai/text/Write%20a%20haiku?model=nova-fast' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

## Error Handling

### Common Error Codes:
- `401` - Unauthorized (invalid API key)
- `402` - Payment Required (insufficient pollen balance)
- `403` - Forbidden (access denied)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Response Format:
```json
{
  "status": 401,
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please provide an API key via Authorization header.",
    "timestamp": "2024-01-26T10:30:00Z"
  }
}
```

## Rate Limits
- Secret keys: No rate limits
- Publishable keys: IP rate-limited (1 pollen per IP per hour)

## Account Management

### Check Balance: `/account/balance`
```bash
curl 'https://gen.pollinations.ai/account/balance' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

### Get Profile: `/account/profile`
```bash
curl 'https://gen.pollinations.ai/account/profile' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

### Usage History: `/account/usage`
```bash
curl 'https://gen.pollinations.ai/account/usage' \
  -H 'Authorization: Bearer YOUR_API_KEY'
```

## LinguaSpark Implementation

### Text Generation Service
```typescript
class PollinationsTextService {
  async generateGameContent(gameType: GameType, options: GameOptions): Promise<GameContent> {
    const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nova-fast',
        messages: this.buildGamePrompt(gameType, options),
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    const data = await response.json();
    return this.parseGameContent(data.choices[0].message.content, gameType);
  }
}
```

### Image Generation Service
```typescript
class PollinationsImageService {
  async generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
    const params = new URLSearchParams({
      model: 'zimage',
      width: options.width?.toString() || '256',
      height: options.height?.toString() || '256',
      seed: options.seed?.toString() || '-1'
    });
    
    const response = await fetch(
      `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}`
        }
      }
    );
    
    const blob = await response.blob();
    return this.blobToDataUrl(blob);
  }
}
```

## Environment Setup

### Required Environment Variables:
```bash
POLLINATIONS_API_KEY=your_api_key_here
GROQ_API_KEY=your_groq_key_here  # For TTS only
```

### Configuration:
- Text Model: `nova-fast` (optimized for speed and quality)
- Image Model: `zimage` (consistent visual quality)
- TTS Provider: Groq (Pollinations TTS removed)

## Migration Notes

### Changes from Old API:
1. **Authentication Required**: All requests need API key
2. **New Base URL**: `gen.pollinations.ai` instead of old endpoints
3. **Model Changes**: Using `nova-fast` for text, `zimage` for images
4. **Response Format**: OpenAI-compatible for text generation
5. **TTS Removed**: Using Groq TTS only

### Backward Compatibility:
- Game interfaces remain the same
- Fallback content available for API failures
- Error handling maintains user experience

## Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Check API key in environment variables
2. **402 Payment Required**: Check pollen balance at enter.pollinations.ai
3. **Slow Response**: Check network connection and API status
4. **Image Generation Fails**: Verify prompt and model parameters

### Support:
- API Documentation: https://enter.pollinations.ai/api/docs
- Dashboard: https://enter.pollinations.ai
- GitHub Issues: For LinguaSpark-specific problems
