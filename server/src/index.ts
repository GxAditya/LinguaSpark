import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import ttsRoutes from './routes/tts.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { seedLessons } from './data/lessons.seed.js';

const app = express();

// Connect to MongoDB and seed data
connectDB().then(async () => {
  // Seed lessons after DB connection
  await seedLessons();
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
