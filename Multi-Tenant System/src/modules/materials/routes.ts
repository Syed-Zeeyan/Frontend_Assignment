import { Router } from 'express';
import { tenantContext } from '../../middleware/tenantContext';
import { userContext } from '../../middleware/userContext';
import { requireAdmin, requireAuthenticated } from '../../middleware/rbac';
import * as materialController from './material.controller';

const router = Router();

/**
 * All material routes require tenant and user context
 */

/**
 * POST /materials
 * Create material (ADMIN only, FREE plan max 5)
 */
router.post(
    '/',
    tenantContext,
    userContext,
    requireAdmin,
    materialController.createMaterial
);

/**
 * GET /materials
 * List materials with optional filters
 */
router.get(
    '/',
    tenantContext,
    userContext,
    requireAuthenticated,
    materialController.listMaterials
);

/**
 * GET /materials/:id
 * Get material with transactions
 */
router.get(
    '/:id',
    tenantContext,
    userContext,
    requireAuthenticated,
    materialController.getMaterial
);

/**
 * DELETE /materials/:id
 * Soft delete material (ADMIN only)
 */
router.delete(
    '/:id',
    tenantContext,
    userContext,
    requireAdmin,
    materialController.deleteMaterial
);

/**
 * POST /materials/:id/transactions
 * Create transaction (Both ADMIN and USER allowed)
 */
router.post(
    '/:id/transactions',
    tenantContext,
    userContext,
    requireAuthenticated,
    materialController.createTransaction
);

export default router;
