import { prisma } from '../../db/client';
import { AppError } from '../../middleware/errorHandler';
import type { TenantContext } from '../../types/express';

/**
 * Get analytics summary (PRO plan only)
 */
export async function getSummary(tenant: TenantContext) {
    // Check PRO plan requirement
    if (tenant.plan !== 'PRO') {
        throw new AppError(
            403,
            'Analytics feature is only available for PRO plan tenants. Please upgrade your plan to access analytics.',
            true,
            { currentPlan: tenant.plan, requiredPlan: 'PRO' }
        );
    }

    // Get materials count (non-deleted only)
    const materialsCount = await prisma.material.count({
        where: {
            tenantId: tenant.id,
            deletedAt: null,
        },
    });

    // Get total IN transactions
    const inResult = await prisma.transaction.aggregate({
        where: {
            tenantId: tenant.id,
            type: 'IN',
        },
        _sum: {
            quantity: true,
        },
    });

    // Get total OUT transactions
    const outResult = await prisma.transaction.aggregate({
        where: {
            tenantId: tenant.id,
            type: 'OUT',
        },
        _sum: {
            quantity: true,
        },
    });

    const totalIn = inResult._sum.quantity || 0;
    const totalOut = outResult._sum.quantity || 0;
    const netChange = totalIn - totalOut;

    return {
        materialsCount,
        totalIn,
        totalOut,
        netChange,
    };
}
