import { type Request, type Response, type NextFunction } from 'express';
import * as analyticsService from './analytics.service';
import { AppError } from '../../middleware/errorHandler';

/**
 * GET /analytics/summary
 * Get analytics summary (PRO plan only)
 */
export async function getSummary(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        // Get summary (service checks PRO plan requirement)
        const summary = await analyticsService.getSummary(req.tenant);

        res.status(200).json({
            status: 'success',
            data: summary,
        });
    } catch (error) {
        next(error);
    }
}
