import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/linguaspark',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default config;
