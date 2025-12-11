import { prisma } from '../../db/client';
import { AppError } from '../../middleware/errorHandler';
import type { CreateUserInput } from '../../validation/schemas';

/**
 * Create a new user under a tenant
 */
export async function createUser(tenantId: string, data: CreateUserInput) {
    const { email, name, role } = data;

    // Check if email already exists for this tenant
    const existingUser = await prisma.user.findFirst({
        where: {
            tenantId,
            email,
        },
    });

    if (existingUser) {
        throw new AppError(
            409,
            'A user with this email already exists in this tenant',
            true,
            { email }
        );
    }

    // Create user
    const user = await prisma.user.create({
        data: {
            tenantId,
            email,
            name,
            role: role || 'USER',
        },
    });

    return user;
}
