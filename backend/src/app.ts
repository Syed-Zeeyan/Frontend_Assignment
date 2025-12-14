import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { rateLimiter } from './middlewares/rateLimiter.middleware';
import logger from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet()); // Set security headers
app.use(
    cors({
        origin: config.cors_origin,
        credentials: true,
    })
);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info('Incoming request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
    next();
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Task Management API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found',
        },
    });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
