import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';

export const validate = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                sendError(
                    res,
                    ERROR_MESSAGES.VALIDATION_ERROR,
                    HTTP_STATUS.BAD_REQUEST,
                    errors
                );
            } else {
                next(error);
            }
        }
    };
};
