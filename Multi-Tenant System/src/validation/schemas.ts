import { z } from 'zod';

/**
 * String-based enums (SQLite compatible)
 * These replace Prisma enums with string literals
 */

// Plan values
export const PlanValues = ['FREE', 'PRO'] as const;
export type Plan = typeof PlanValues[number];

// Role values
export const RoleValues = ['ADMIN', 'USER'] as const;
export type Role = typeof RoleValues[number];

// TransactionType values
export const TransactionTypeValues = ['IN', 'OUT'] as const;
export type TransactionType = typeof TransactionTypeValues[number];

/**
 * Validation schemas for request bodies and query parameters
 */

// Tenant schemas
export const createTenantSchema = z.object({
    name: z.string().min(1, 'Tenant name is required').max(100),
    plan: z.enum(PlanValues).default('FREE'),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;

// Material schemas
export const createMaterialSchema = z.object({
    name: z.string().min(1, 'Material name is required').max(100),
    unit: z.string().min(1, 'Unit is required').max(20),
});

export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;

export const materialQuerySchema = z.object({
    name: z.string().optional(),
    unit: z.string().optional(),
});

export type MaterialQueryInput = z.infer<typeof materialQuerySchema>;

// Transaction schemas
export const createTransactionSchema = z.object({
    type: z.enum(TransactionTypeValues),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// User schemas
export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required').max(100),
    role: z.enum(RoleValues).default('USER'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
