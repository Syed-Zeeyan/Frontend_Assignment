import { type Request, type Response, type NextFunction } from 'express';
import { createUserSchema } from '../../validation/schemas';
import * as usersService from './users.service';
import { AppError } from '../../middleware/errorHandler';

/**
 * POST /users
 * Create a new user (ADMIN only)
 */
export async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        // Validate request body
        const validationResult = createUserSchema.safeParse(req.body);

        if (!validationResult.success) {
            throw new AppError(
                400,
                'Invalid request data',
                true,
                validationResult.error.format()
            );
        }

        // Create user
        const user = await usersService.createUser(
            req.tenant.id,
            validationResult.data
        );

        res.status(201).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
}
