import { z } from 'zod';
import { TASK_STATUS, TASK_PRIORITY } from '../config/constants';

export const createTaskSchema = z.object({
    body: z.object({
        title: z
            .string({
                required_error: 'Title is required',
            })
            .min(3, 'Title must be at least 3 characters')
            .max(200, 'Title must not exceed 200 characters')
            .trim(),
        description: z
            .string()
            .max(2000, 'Description must not exceed 2000 characters')
            .trim()
            .optional(),
        status: z
            .enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED])
            .optional()
            .default(TASK_STATUS.PENDING),
        priority: z
            .enum([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
            .optional()
            .default(TASK_PRIORITY.MEDIUM),
        dueDate: z
            .string()
            .datetime('Invalid date format')
            .transform((str) => new Date(str))
            .optional(),
    }),
});

export const updateTaskSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(3, 'Title must be at least 3 characters')
            .max(200, 'Title must not exceed 200 characters')
            .trim()
            .optional(),
        description: z
            .string()
            .max(2000, 'Description must not exceed 2000 characters')
            .trim()
            .optional(),
        status: z
            .enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED])
            .optional(),
        priority: z
            .enum([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH])
            .optional(),
        dueDate: z
            .string()
            .datetime('Invalid date format')
            .transform((str) => new Date(str))
            .optional()
            .nullable(),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
    }),
});

export const updateTaskStatusSchema = z.object({
    body: z.object({
        status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED], {
            required_error: 'Status is required',
        }),
    }),
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
    }),
});

export const getTaskSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID'),
    }),
});

export const getTasksQuerySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED]).optional(),
        priority: z.enum([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH]).optional(),
        sort: z.enum(['createdAt', 'updatedAt', 'dueDate', 'title']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>['body'];
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>['query'];
