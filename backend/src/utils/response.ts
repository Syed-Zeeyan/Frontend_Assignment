import { Response } from 'express';
import { HTTP_STATUS } from '../config/constants';

interface SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;
}

interface ErrorResponse {
    success: false;
    error: {
        message: string;
        details?: any;
    };
}

export const sendSuccess = <T = any>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
): Response<SuccessResponse<T>> => {
    const response: SuccessResponse<T> = {
        success: true,
        data,
    };

    if (message) {
        response.message = message;
    }

    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: any
): Response<ErrorResponse> => {
    const response: ErrorResponse = {
        success: false,
        error: {
            message,
        },
    };

    if (details) {
        response.error.details = details;
    }

    return res.status(statusCode).json(response);
};
