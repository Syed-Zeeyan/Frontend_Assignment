import { Router, type Request, type Response, type NextFunction } from 'express';
import { tenantContext } from '../../middleware/tenantContext';
import { userContext, optionalUserContext } from '../../middleware/userContext';
import { requireRole, requireAdmin } from '../../middleware/rbac';

const router = Router();

/**
 * Example route demonstrating middleware usage
 * 
 * This shows how to apply tenant context, user context, and RBAC middleware
 * to protect routes based on tenant isolation and user roles.
 */

// ============================================
// Public routes (no tenant/user required)
// ============================================

/**
 * GET /api/example/public
 * Public endpoint - no authentication required
 */
router.get('/public', (_req: Request, res: Response) => {
    res.json({
        message: 'This is a public endpoint',
        requiresAuth: false,
    });
});

// ============================================
// Tenant-scoped routes (tenant required)
// ============================================

/**
 * GET /api/example/tenant-info
 * Requires: Tenant context
 * Shows current tenant information
 */
router.get(
    '/tenant-info',
    tenantContext,
    (req: Request, res: Response) => {
        res.json({
            message: 'Tenant information',
            tenant: req.tenant,
        });
    }
);

/**
 * GET /api/example/optional-user
 * Requires: Tenant context
 * Optional: User context
 * Works with or without user authentication
 */
router.get(
    '/optional-user',
    tenantContext,
    optionalUserContext,
    (req: Request, res: Response) => {
        res.json({
            message: req.user ? 'Authenticated request' : 'Anonymous request',
            tenant: req.tenant,
            user: req.user || null,
        });
    }
);

// ============================================
// Authenticated routes (tenant + user required)
// ============================================

/**
 * GET /api/example/profile
 * Requires: Tenant context, User context
 * Shows current user profile
 */
router.get(
    '/profile',
    tenantContext,
    userContext,
    (req: Request, res: Response) => {
        res.json({
            message: 'User profile',
            tenant: req.tenant,
            user: req.user,
        });
    }
);

/**
 * GET /api/example/user-or-admin
 * Requires: Tenant context, User context (any role)
 * Accessible by both ADMIN and USER roles
 */
router.get(
    '/user-or-admin',
    tenantContext,
    userContext,
    requireRole('ADMIN', 'USER'),
    (req: Request, res: Response) => {
        res.json({
            message: 'Accessible by any authenticated user',
            user: req.user,
        });
    }
);

// ============================================
// Admin-only routes (tenant + admin user required)
// ============================================

/**
 * POST /api/example/admin-action
 * Requires: Tenant context, Admin user
 * Only accessible by ADMIN role
 */
router.post(
    '/admin-action',
    tenantContext,
    userContext,
    requireAdmin,
    (req: Request, res: Response) => {
        res.json({
            message: 'Admin action performed',
            tenant: req.tenant,
            admin: req.user,
        });
    }
);

/**
 * DELETE /api/example/admin-only/:id
 * Requires: Tenant context, Admin user
 * Demonstrates parameterized route with admin access
 */
router.delete(
    '/admin-only/:id',
    tenantContext,
    userContext,
    requireAdmin,
    (req: Request, res: Response) => {
        res.json({
            message: 'Resource deleted (admin only)',
            resourceId: req.params.id,
            tenant: req.tenant,
            admin: req.user,
        });
    }
);

// ============================================
// Error handling examples
// ============================================

/**
 * GET /api/example/throw-error
 * Demonstrates custom AppError
 */
router.get(
    '/throw-error',
    (_req: Request, _res: Response, next: NextFunction) => {
        const { AppError } = require('../../middleware/errorHandler');
        next(new AppError(400, 'This is a custom error', true, { example: 'details' }));
    }
);

export default router;
