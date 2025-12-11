import { prisma } from '../../db/client';
import type { CreateTenantInput } from '../../validation/schemas';

/**
 * Generate a slugified email from tenant name
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Create a new tenant with default admin user
 */
export async function createTenant(data: CreateTenantInput) {
    const { name, plan } = data;

    // Create tenant and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create tenant
        const tenant = await tx.tenant.create({
            data: {
                name,
                plan: plan || 'FREE',
            },
        });

        // Create default admin user
        const adminEmail = `admin@${slugify(name)}.local`;
        const adminUser = await tx.user.create({
            data: {
                tenantId: tenant.id,
                email: adminEmail,
                name: 'Admin User',
                role: 'ADMIN',
            },
        });

        return { tenant, adminUser };
    });

    return result;
}
