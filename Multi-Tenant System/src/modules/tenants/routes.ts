import { Router } from 'express';
import * as tenantController from './tenant.controller';

const router = Router();

/**
 * POST /tenants
 * Public endpoint - no authentication required
 * Creates a new tenant with default admin user
 */
router.post('/', tenantController.createTenant);

export default router;
