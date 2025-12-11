import { type Request, type Response, type NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: unknown;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true,
        details?: unknown
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;

        // Maintains proper stack trace for where error was thrown
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error response interface
 */
interface ErrorResponse {
    status: 'error';
    statusCode: number;
    message: string;
    details?: unknown;
    stack?: string;
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
    switch (error.code) {
        case 'P2002':
            // Unique constraint violation
            return new AppError(
                409,
                'A record with this value already exists.',
                true,
                { field: error.meta?.target }
            );

        case 'P2025':
            // Record not found
            return new AppError(
                404,
                'The requested record was not found.',
                true
            );

        case 'P2003':
            // Foreign key constraint violation
            return new AppError(
                400,
                'Invalid reference. The related record does not exist.',
                true,
                { field: error.meta?.field_name }
            );

        case 'P2014':
            // Required relation violation
            return new AppError(
                400,
                'The operation violates a required relation.',
                true
            );

        default:
            return new AppError(
                500,
                'A database error occurred.',
                true,
                process.env.NODE_ENV === 'development' ? { code: error.code, meta: error.meta } : undefined
            );
    }
}

/**
 * Global error handling middleware
 * Handles AppError, Prisma errors, and unexpected errors
 */
export function errorHandler(
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    let error: AppError;

    // Handle different types of errors
    if (err instanceof AppError) {
        error = err;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(err);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
        error = new AppError(400, 'Invalid data provided to the database.', true);
    } else {
        // Unknown error - log it and return generic 500
        console.error('❌ Unexpected error:', err);
        error = new AppError(
            500,
            'An unexpected error occurred. Please try again later.',
            false
        );
    }

    // Log operational errors in development
    if (process.env.NODE_ENV === 'development' && error.isOperational) {
        console.error(`⚠️  ${error.statusCode} Error:`, error.message);
    }

    // Construct error response
    const response: ErrorResponse = {
        status: 'error',
        statusCode: error.statusCode,
        message: error.message,
    };

    // Add details if available
    if (error.details) {
        response.details = error.details;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(error.statusCode).json(response);
}
