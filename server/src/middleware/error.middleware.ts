import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    statusCode = 400;
    const field = Object.keys((err as any).keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values((err as any).errors).map(
      (val: any) => val.message
    );
    message = messages.join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
