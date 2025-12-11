import { type Request, type Response, type NextFunction } from 'express';
import type { Role } from '../validation/schemas';
import { AppError } from './errorHandler';

/**
 * Role-Based Access Control (RBAC) middleware
 * Checks if the authenticated user has one of the required roles
 * 
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns Express middleware function
 * 
 * @requires userContext middleware must be applied first
 * @throws {AppError} 401 if user context is not present
 * @throws {AppError} 403 if user role is not in allowed roles
 * 
 * @example
 * // Only allow ADMIN users
 * router.post('/materials', requireRole('ADMIN'), createMaterial);
 * 
 * @example
 * // Allow both ADMIN and USER roles
 * router.get('/materials', requireRole('ADMIN', 'USER'), listMaterials);
 */
export function requireRole(...allowedRoles: Role[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            // Ensure user context exists
            if (!req.user) {
                throw new AppError(
                    401,
                    'Authentication required. Please provide valid user credentials.'
                );
            }

            // Check if user role is in allowed roles
            if (!allowedRoles.includes(req.user.role)) {
                throw new AppError(
                    403,
                    `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}.`
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

/**
 * Convenience middleware to require ADMIN role only
 * 
 * @example
 * router.delete('/materials/:id', requireAdmin, deleteMaterial);
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * Convenience middleware to allow any authenticated user (ADMIN or USER)
 * 
 * @example
 * router.get('/materials', requireAuthenticated, listMaterials);
 */
export const requireAuthenticated = requireRole('ADMIN', 'USER');
