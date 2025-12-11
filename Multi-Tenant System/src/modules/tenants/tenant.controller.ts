import { type Request, type Response, type NextFunction } from 'express';
import { createTenantSchema } from '../../validation/schemas';
import * as tenantService from './tenant.service';
import { AppError } from '../../middleware/errorHandler';

/**
 * POST /tenants
 * Create a new tenant with default admin user
 */
export async function createTenant(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Validate request body
        const validationResult = createTenantSchema.safeParse(req.body);

        if (!validationResult.success) {
            throw new AppError(
                400,
                'Invalid request data',
                true,
                validationResult.error.format()
            );
        }

        // Create tenant
        const result = await tenantService.createTenant(validationResult.data);

        res.status(201).json({
            status: 'success',
            data: {
                tenant: {
                    id: result.tenant.id,
                    name: result.tenant.name,
                    plan: result.tenant.plan,
                    createdAt: result.tenant.createdAt,
                },
                adminUser: {
                    id: result.adminUser.id,
                    email: result.adminUser.email,
                    name: result.adminUser.name,
                    role: result.adminUser.role,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}
