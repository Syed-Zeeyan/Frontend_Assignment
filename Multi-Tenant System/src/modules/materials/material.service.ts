import { prisma } from '../../db/client';
import { AppError } from '../../middleware/errorHandler';
import type { TenantContext } from '../../types/express';
import type { CreateMaterialInput, MaterialQueryInput, CreateTransactionInput } from '../../validation/schemas';

/**
 * Create a new material with FREE plan limit enforcement
 */
export async function createMaterial(tenant: TenantContext, data: CreateMaterialInput) {
    // Check FREE plan limit (max 5 active materials)
    if (tenant.plan === 'FREE') {
        const activeMaterialsCount = await prisma.material.count({
            where: {
                tenantId: tenant.id,
                deletedAt: null,
            },
        });

        if (activeMaterialsCount >= 5) {
            throw new AppError(
                422,
                'FREE plan is limited to 5 active materials. Please upgrade to PRO plan or delete existing materials.',
                true,
                { currentCount: activeMaterialsCount, limit: 5 }
            );
        }
    }

    // Create material
    const material = await prisma.material.create({
        data: {
            tenantId: tenant.id,
            name: data.name,
            unit: data.unit,
            currentStock: 0,
        },
    });

    return material;
}

/**
 * List materials with optional filters
 */
export async function listMaterials(tenantId: string, filters?: MaterialQueryInput) {
    const where: any = {
        tenantId,
        deletedAt: null, // Only non-deleted materials
    };

    // Apply filters
    if (filters?.name) {
        where.name = {
            contains: filters.name,
            mode: 'insensitive',
        };
    }

    if (filters?.unit) {
        where.unit = filters.unit;
    }

    const materials = await prisma.material.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    return materials;
}

/**
 * Get material with transactions
 */
export async function getMaterialWithTransactions(tenantId: string, materialId: string) {
    const material = await prisma.material.findFirst({
        where: {
            id: materialId,
            tenantId, // Ensure tenant isolation
        },
        include: {
            transactions: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!material) {
        throw new AppError(404, 'Material not found or does not belong to this tenant');
    }

    return material;
}

/**
 * Soft delete material
 */
export async function softDeleteMaterial(tenantId: string, materialId: string) {
    // Verify material exists and belongs to tenant
    const material = await prisma.material.findFirst({
        where: {
            id: materialId,
            tenantId,
        },
    });

    if (!material) {
        throw new AppError(404, 'Material not found or does not belong to this tenant');
    }

    if (material.deletedAt) {
        throw new AppError(400, 'Material is already deleted');
    }

    // Soft delete
    await prisma.material.update({
        where: { id: materialId },
        data: { deletedAt: new Date() },
    });
}

/**
 * Create transaction and update stock
 */
export async function createTransaction(
    tenantId: string,
    materialId: string,
    data: CreateTransactionInput
) {
    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
        // Get material and verify it belongs to tenant
        const material = await tx.material.findFirst({
            where: {
                id: materialId,
                tenantId,
            },
        });

        if (!material) {
            throw new AppError(404, 'Material not found or does not belong to this tenant');
        }

        // Check if material is deleted
        if (material.deletedAt) {
            throw new AppError(
                400,
                'Cannot create transactions for deleted materials',
                true,
                { materialId, deletedAt: material.deletedAt }
            );
        }

        // Calculate new stock
        let newStock = material.currentStock;
        if (data.type === 'IN') {
            newStock += data.quantity;
        } else if (data.type === 'OUT') {
            newStock -= data.quantity;

            // Validate stock doesn't go negative
            if (newStock < 0) {
                throw new AppError(
                    400,
                    'Insufficient stock for OUT transaction',
                    true,
                    {
                        currentStock: material.currentStock,
                        requestedQuantity: data.quantity,
                        shortfall: Math.abs(newStock),
                    }
                );
            }
        }

        // Create transaction
        const transaction = await tx.transaction.create({
            data: {
                tenantId,
                materialId,
                type: data.type,
                quantity: data.quantity,
            },
        });

        // Update material stock
        await tx.material.update({
            where: { id: materialId },
            data: { currentStock: newStock },
        });

        return { transaction, newStock };
    });

    return result;
}
