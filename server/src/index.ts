import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// Connect to MongoDB
connectDB();

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
