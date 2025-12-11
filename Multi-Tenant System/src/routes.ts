import { type Application, type Request, type Response } from 'express';
import tenantRoutes from './modules/tenants/routes';
import materialRoutes from './modules/materials/routes';
import analyticsRoutes from './modules/analytics/routes';
import usersRoutes from './modules/users/users.routes';

/**
 * Register all application routes
 * @param app - Express application instance
 */
export function registerRoutes(app: Application): void {
    // Health check endpoint (no authentication required)
    app.get('/health', (_req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    });

    // API routes
    app.use('/tenants', tenantRoutes);
    app.use('/users', usersRoutes);
    app.use('/materials', materialRoutes);
    app.use('/analytics', analyticsRoutes);
}
