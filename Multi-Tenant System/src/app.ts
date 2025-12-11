import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { tenantContext } from './middleware/tenantContext';
import { userContext } from './middleware/userContext';
import { registerRoutes } from './routes';

/**
 * Creates and configures the Express application
 * @returns Configured Express application instance
 */
export function createApp(): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS middleware
    app.use(cors());

    // Request logging
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register all routes (routes will apply tenant/user middleware as needed)
    registerRoutes(app);

    // Error handling middleware (must be last)
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}

/**
 * Export middleware for use in routes
 */
export { tenantContext, userContext };
