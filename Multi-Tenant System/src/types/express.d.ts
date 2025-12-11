import type { Plan, Role } from '../validation/schemas';

/**
 * Tenant context attached to Express Request
 */
export interface TenantContext {
    id: string;
    name: string;
    plan: Plan;
}

/**
 * User context attached to Express Request
 */
export interface UserContext {
    id: string;
    email: string;
    name: string;
    role: Role;
    tenantId: string;
}

/**
 * Augment Express Request type to include tenant and user context
 */
declare global {
    namespace Express {
        interface Request {
            tenant?: TenantContext;
            user?: UserContext;
        }
    }
}

export { };
