import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../db/client';
import { AppError } from './errorHandler';
import type { UserContext } from '../types/express';

/**
 * User context middleware
 * Reads X-User-Id header, loads user from database, validates tenant membership,
 * and attaches to request
 * 
 * @requires tenantContext middleware must be applied first
 * @throws {AppError} 400 if X-User-Id header is missing
 * @throws {AppError} 404 if user not found
 * @throws {AppError} 403 if user does not belong to the current tenant
 */
export async function userContext(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.headers['x-user-id'] as string;

        // Validate user ID header is present
        if (!userId) {
            throw new AppError(
                400,
                'Missing X-User-Id header. Please provide a valid user identifier.'
            );
        }

        // Ensure tenant context exists
        if (!req.tenant) {
            throw new AppError(
                500,
                'Tenant context not initialized. User context requires tenant context middleware.'
            );
        }

        // Load user from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
            },
        });

        // Validate user exists
        if (!user) {
            throw new AppError(
                404,
                `User with ID '${userId}' not found. Please verify the user ID.`
            );
        }

        // Validate user belongs to the current tenant (tenant isolation)
        if (user.tenantId !== req.tenant.id) {
            throw new AppError(
                403,
                'Access denied. User does not belong to the specified tenant.'
            );
        }

        // Attach user context to request
        req.user = user as UserContext;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Optional user context middleware
 * Loads user if X-User-Id header is present, but doesn't fail if missing
 * Useful for endpoints that work for both authenticated and anonymous users
 * 
 * @requires tenantContext middleware must be applied first
 */
export async function optionalUserContext(
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const userId = req.headers['x-user-id'] as string;

        // If no user ID provided, continue without user context
        if (!userId) {
            return next();
        }

        // Ensure tenant context exists
        if (!req.tenant) {
            throw new AppError(
                500,
                'Tenant context not initialized. User context requires tenant context middleware.'
            );
        }

        // Load user from database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
            },
        });

        // Silently skip if user not found (optional context)
        if (!user) {
            return next();
        }

        // Validate user belongs to the current tenant
        if (user.tenantId !== req.tenant.id) {
            throw new AppError(
                403,
                'Access denied. User does not belong to the specified tenant.'
            );
        }

        // Attach user context to request
        req.user = user as UserContext;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Helper to require user context
 * Use this for routes that must have user context
 */
export function requireUser(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    if (!req.user) {
        throw new AppError(
            401,
            'Authentication required. Please provide X-User-Id header.'
        );
    }
    next();
}
