import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../db/client';
import { AppError } from './errorHandler';
import type { TenantContext } from '../types/express';

/**
 * Tenant context middleware
 * Reads X-Tenant-Id header, loads tenant from database, and attaches to request
 * 
 * @throws {AppError} 400 if X-Tenant-Id header is missing
 * @throws {AppError} 404 if tenant not found
 */
export async function tenantContext(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tenantId = req.headers['x-tenant-id'] as string;

        // Validate tenant ID header is present
        if (!tenantId) {
            throw new AppError(
                400,
                'Missing X-Tenant-Id header. Please provide a valid tenant identifier.'
            );
        }

        // Load tenant from database
        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                id: true,
                name: true,
                plan: true,
            },
        });

        // Validate tenant exists
        if (!tenant) {
            throw new AppError(
                404,
                `Tenant with ID '${tenantId}' not found. Please verify the tenant ID.`
            );
        }

        // Attach tenant context to request
        req.tenant = tenant as TenantContext;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Helper to require tenant context
 * Use this for routes that must have tenant context
 */
export function requireTenant(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    if (!req.tenant) {
        throw new AppError(
            500,
            'Tenant context not initialized. This is a server configuration error.'
        );
    }
    next();
}
