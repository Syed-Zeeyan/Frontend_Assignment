import { type Request, type Response, type NextFunction } from 'express';
import {
    createMaterialSchema,
    materialQuerySchema,
    createTransactionSchema,
} from '../../validation/schemas';
import * as materialService from './material.service';
import { AppError } from '../../middleware/errorHandler';

/**
 * POST /materials
 * Create a new material (ADMIN only)
 */
export async function createMaterial(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        // Validate request body
        const validationResult = createMaterialSchema.safeParse(req.body);

        if (!validationResult.success) {
            throw new AppError(
                400,
                'Invalid request data',
                true,
                validationResult.error.format()
            );
        }

        // Create material
        const material = await materialService.createMaterial(
            req.tenant,
            validationResult.data
        );

        res.status(201).json({
            status: 'success',
            data: { material },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /materials
 * List materials with optional filters
 */
export async function listMaterials(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        // Validate query parameters
        const validationResult = materialQuerySchema.safeParse(req.query);

        if (!validationResult.success) {
            throw new AppError(
                400,
                'Invalid query parameters',
                true,
                validationResult.error.format()
            );
        }

        // List materials
        const materials = await materialService.listMaterials(
            req.tenant.id,
            validationResult.data
        );

        res.status(200).json({
            status: 'success',
            data: { materials, count: materials.length },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /materials/:id
 * Get material with transactions
 */
export async function getMaterial(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        const { id } = req.params;

        if (!id) {
            throw new AppError(400, 'Material ID is required');
        }

        // Get material with transactions
        const material = await materialService.getMaterialWithTransactions(
            req.tenant.id,
            id
        );

        res.status(200).json({
            status: 'success',
            data: { material },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /materials/:id
 * Soft delete material (ADMIN only)
 */
export async function deleteMaterial(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        const { id } = req.params;

        if (!id) {
            throw new AppError(400, 'Material ID is required');
        }

        // Soft delete material
        await materialService.softDeleteMaterial(req.tenant.id, id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

/**
 * POST /materials/:id/transactions
 * Create a transaction (IN/OUT) and update stock
 */
export async function createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.tenant) {
            throw new AppError(500, 'Tenant context not initialized');
        }

        const { id } = req.params;

        if (!id) {
            throw new AppError(400, 'Material ID is required');
        }

        // Validate request body
        const validationResult = createTransactionSchema.safeParse(req.body);

        if (!validationResult.success) {
            throw new AppError(
                400,
                'Invalid request data',
                true,
                validationResult.error.format()
            );
        }

        // Create transaction
        const result = await materialService.createTransaction(
            req.tenant.id,
            id,
            validationResult.data
        );

        res.status(201).json({
            status: 'success',
            data: {
                transaction: result.transaction,
                newStock: result.newStock,
            },
        });
    } catch (error) {
        next(error);
    }
}
