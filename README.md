# LinguaSpark

A modern language learning platform with interactive games and AI-powered content generation.

## Features

- Interactive language learning games
- AI-generated content using Pollinations API
- Text-to-speech functionality with Groq
- User authentication with Google and GitHub OAuth
- Progress tracking and gamification
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- API keys for external services (see Environment Setup)

## Environment Setup

### Required API Keys

1. **Pollinations API Key** (Required)
   - Visit [https://gen.pollinations.ai](https://gen.pollinations.ai)
   - Sign up and get your API key
   - Used for AI text and image generation

2. **Groq API Key** (Recommended)
   - Visit [https://console.groq.com](https://console.groq.com)
   - Sign up and get your API key
   - Used for text-to-speech functionality

3. **Google OAuth** (Optional)
   - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI to: `http://localhost:5173/auth/google/callback`

4. **GitHub OAuth** (Optional)
   - Visit [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Set authorization callback URL to: `http://localhost:5173/auth/github/callback`

### Environment Configuration

1. **Frontend Environment** (`.env`)
   ```bash
   # API URL
   VITE_API_URL=http://localhost:5000/api
   
   # OAuth Client IDs (public - can be exposed to frontend)
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_GITHUB_CLIENT_ID=your-github-client-id
   
   # Pollinations API Key
   POLLINATIONS_API_KEY=your-pollinations-api-key
   ```

2. **Backend Environment** (`server/.env`)
   ```bash
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/linguaspark
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   
   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173
   
   # OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # API Keys
   POLLINATIONS_API_KEY=your-pollinations-api-key
   GROQ_API_KEY=your-groq-api-key
   ```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linguaspark
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   # Copy example files and fill in your values
   cp .env.example .env
   cp server/.env.example server/.env
   ```

5. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

## Development

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

## API Configuration

### Pollinations API

The application uses the new authenticated Pollinations API at `gen.pollinations.ai`:

- **Text Generation**: Uses `nova-fast` model via `/v1/chat/completions`
- **Image Generation**: Uses `zimage` model via `/image/{prompt}`
- **Authentication**: Bearer token authentication required

### Groq API

Used for text-to-speech functionality:

- **Model**: `playai-tts`
- **Supported Voices**: Multiple voice options available
- **Fallback**: Browser TTS when API is unavailable

## Troubleshooting

### Common Issues

1. **"POLLINATIONS_API_KEY is required" error**
   - Ensure you have set the API key in both `.env` and `server/.env`
   - Verify the API key is valid at [gen.pollinations.ai](https://gen.pollinations.ai)

2. **MongoDB connection errors**
   - Check if MongoDB is running locally
   - Verify the `MONGODB_URI` in `server/.env`

3. **OAuth login not working**
   - Verify OAuth credentials are correctly set
   - Check redirect URIs match your configuration

4. **TTS not working**
   - Check if `GROQ_API_KEY` is set in `server/.env`
   - Verify API key is valid at [console.groq.com](https://console.groq.com)

### Configuration Validation

The server performs automatic configuration validation on startup:

- ✅ Required environment variables are checked
- ⚠️ Warnings for optional but recommended settings
- ❌ Server won't start if critical configuration is missing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]
