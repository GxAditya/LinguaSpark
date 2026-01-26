import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up two directories from src/config to reach server/, where .env is located
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
  google: {
    clientId: string;
    clientSecret: string;
  };
  github: {
    clientId: string;
    clientSecret: string;
  };
  groq: {
    apiKey: string;
  };
  pollinations: {
    apiKey: string;
    baseUrl: string;
    textModel: string;
    imageModel: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/linguaspark',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
  },
  pollinations: {
    apiKey: process.env.POLLINATIONS_API_KEY || '',
    baseUrl: 'https://gen.pollinations.ai',
    textModel: 'nova-fast',
    imageModel: 'zimage',
  },
};

// Configuration validation
export function validateConfig(): void {
  const errors: string[] = [];

  // Critical configuration checks
  if (!config.jwtSecret || config.jwtSecret === 'default-secret-key') {
    errors.push('JWT_SECRET must be set to a secure value in production');
  }

  if (!config.mongodbUri) {
    errors.push('MONGODB_URI is required');
  }

  // API key validations
  if (!config.pollinations.apiKey) {
    errors.push('POLLINATIONS_API_KEY is required for AI content generation');
  }

  if (!config.groq.apiKey) {
    console.warn('⚠️  GROQ_API_KEY not found - TTS functionality will be limited');
  }

  // OAuth configuration warnings (not critical for basic functionality)
  if (!config.google.clientId || !config.google.clientSecret) {
    console.warn('⚠️  Google OAuth not configured - Google sign-in will be unavailable');
  }

  if (!config.github.clientId || !config.github.clientSecret) {
    console.warn('⚠️  GitHub OAuth not configured - GitHub sign-in will be unavailable');
  }

  // Throw error if critical configuration is missing
  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Invalid configuration. Please check your environment variables.');
  }

  console.log('✅ Configuration validation passed');
}

export default config;
