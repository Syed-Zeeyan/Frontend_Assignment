import { Router } from 'express';
import { tenantContext } from '../../middleware/tenantContext';
import { userContext } from '../../middleware/userContext';
import { requireAdmin } from '../../middleware/rbac';
import * as usersController from './users.controller';

const router = Router();

/**
 * POST /users
 * Create a new user (ADMIN only)
 */
router.post(
    '/',
    tenantContext,
    userContext,
    requireAdmin,
    usersController.createUser
);

export default router;
