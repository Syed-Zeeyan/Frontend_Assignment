import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import logger from '../utils/logger';
import config from '../config/config';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Default error values
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message: string = ERROR_MESSAGES.INTERNAL_ERROR;
    let details: unknown = undefined;

    // Handle AppError (custom errors)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Mongoose validation errors
    else if (err.name === 'ValidationError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_ERROR;
        details = Object.values((err as unknown as { errors: Record<string, { path: string; message: string }> }).errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }

    // Handle Mongoose duplicate key errors
    else if ((err as unknown as { code?: number }).code === 11000) {
        statusCode = HTTP_STATUS.CONFLICT;
        const field = Object.keys((err as unknown as { keyPattern: Record<string, unknown> }).keyPattern)[0];
        message = `${field} already exists`;
    }

    // Handle Mongoose cast errors (invalid ObjectId)
    else if (err.name === 'CastError') {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = 'Invalid ID format';
    }

    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = ERROR_MESSAGES.TOKEN_INVALID;
    }

    else if (err.name === 'TokenExpiredError') {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        message = ERROR_MESSAGES.TOKEN_EXPIRED;
    }

    // Log error
    logger.error('Error occurred', {
        statusCode,
        message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    // Send error response
    sendError(
        res,
        message,
        statusCode,
        config.node_env === 'development' ? { stack: err.stack, ...(details as object || {}) } : details
    );
};
