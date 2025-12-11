import { type Request, type Response } from 'express';

/**
 * 404 Not Found handler middleware
 * This should be registered after all valid routes
 */
export function notFoundHandler(_req: Request, res: Response): void {
    res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Resource not found'
    });
}
