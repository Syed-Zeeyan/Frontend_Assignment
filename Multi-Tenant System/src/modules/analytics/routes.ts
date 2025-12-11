import { Router } from 'express';
import { tenantContext } from '../../middleware/tenantContext';
import { userContext } from '../../middleware/userContext';
import { requireAuthenticated } from '../../middleware/rbac';
import * as analyticsController from './analytics.controller';

const router = Router();

/**
 * GET /analytics/summary
 * Get analytics summary (PRO plan only, checked in service)
 */
router.get(
    '/summary',
    tenantContext,
    userContext,
    requireAuthenticated,
    analyticsController.getSummary
);

export default router;
