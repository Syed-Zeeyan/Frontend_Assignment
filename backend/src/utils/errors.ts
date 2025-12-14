import { HTTP_STATUS } from '../config/constants';

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
}
