import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, config.jwtSecret) as { id: string };
};
