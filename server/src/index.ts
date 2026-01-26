import express from 'express';
import cors from 'cors';
import config, { validateConfig } from './config/index.js';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import ttsRoutes from './routes/tts.routes.js';
import practiceRoutes from './routes/practice.routes.js';
import gameRoutes from './routes/game.routes.js';
import pollinationsRoutes from './routes/pollinations.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { seedLessons } from './data/lessons.seed.js';
import { pollinationsApi } from './services/pollinations.api.service.js';

const app = express();

// Validate configuration before starting the server
try {
  validateConfig();
} catch (error) {
  console.error('Server startup failed due to configuration errors');
  process.exit(1);
}

// Validate Pollinations API connection
async function validatePollinationsAPI() {
  try {
    console.log('🔑 Validating Pollinations API connection...');
    const isValid = await pollinationsApi.validateConnection();
    
    if (isValid) {
      console.log('✅ Pollinations API connection validated successfully');
    } else {
      console.warn('⚠️  Pollinations API validation failed - AI features may be limited');
    }
  } catch (error) {
    console.warn('⚠️  Pollinations API validation error:', error);
    console.warn('   AI features may be limited until API key is configured properly');
  }
}

// Connect to MongoDB and seed data
connectDB().then(async () => {
  // Seed lessons after DB connection
  await seedLessons();
  
  // Validate Pollinations API after DB setup
  await validatePollinationsAPI();
});

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LinguaSpark API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/pollinations', pollinationsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
🚀 LinguaSpark Server is running!
📍 URL: http://localhost:${config.port}
🌍 Environment: ${config.nodeEnv}
  `);
});

export default app;
