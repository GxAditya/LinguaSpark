<p align="center">
  <img src="public/Linguaspark-logo.png" alt="LinguaSpark Logo" width="128">
</p>

<h1 align="center">LinguaSpark</h1>

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/GxAditya/LinguaSpark?style=flat-square" alt="License">
  </a>
  <a href="CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
</p>

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
- API keys for external services (see [CONTRIBUTING.md](CONTRIBUTING.md))

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
   git clone https://github.com/GxAditya/LinguaSpark.git
   cd LinguaSpark
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

## Documentation

For detailed information on API configuration, troubleshooting, and how to contribute, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.