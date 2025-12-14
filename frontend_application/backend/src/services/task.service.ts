import Task, { ITask } from '../models/Task.model';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { ERROR_MESSAGES, PAGINATION } from '../config/constants';
import { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput, GetTasksQuery } from '../validators/task.validator';
import logger from '../utils/logger';
import mongoose from 'mongoose';

interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class TaskService {
    /**
     * Get all tasks for a user with pagination and filters
     */
    async getTasks(userId: string, query: GetTasksQuery): Promise<PaginatedResult<ITask>> {
        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            status,
            priority,
            sort = 'createdAt',
            order = 'desc',
        } = query;

        // Validate and sanitize limit
        const sanitizedLimit = Math.min(Math.max(1, limit), PAGINATION.MAX_LIMIT);
        const skip = (page - 1) * sanitizedLimit;

        // Build filter
        const filter: any = { userId };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Build sort
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj: any = { [sort]: sortOrder };

        // Execute query
        const [tasks, total] = await Promise.all([
            Task.find(filter).sort(sortObj).skip(skip).limit(sanitizedLimit),
            Task.countDocuments(filter),
        ]);

        logger.info('Tasks retrieved', {
            userId,
            count: tasks.length,
            total,
            page,
            limit: sanitizedLimit,
        });

        return {
            data: tasks,
            pagination: {
                total,
                page,
                limit: sanitizedLimit,
                totalPages: Math.ceil(total / sanitizedLimit),
            },
        };
    }

    /**
     * Get single task by ID
     */
    async getTaskById(taskId: string, userId: string): Promise<ITask> {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
        }

        // Verify task belongs to user
        if (task.userId.toString() !== userId) {
            throw new AuthorizationError(ERROR_MESSAGES.TASK_ACCESS_DENIED);
        }

        return task;
    }

    /**
     * Create a new task
     */
    async createTask(userId: string, input: CreateTaskInput): Promise<ITask> {
        const task = await Task.create({
            ...input,
            userId: new mongoose.Types.ObjectId(userId),
        });

        logger.info('Task created', { taskId: task._id, userId });

        return task;
    }

    /**
     * Update a task
     */
    async updateTask(taskId: string, userId: string, input: UpdateTaskInput): Promise<ITask> {
        const task = await this.getTaskById(taskId, userId);

        // Update fields
        Object.assign(task, input);
        await task.save();

        logger.info('Task updated', { taskId: task._id, userId });

        return task;
    }

    /**
     * Update task status only
     */
    async updateTaskStatus(
        taskId: string,
        userId: string,
        input: UpdateTaskStatusInput
    ): Promise<ITask> {
        const task = await this.getTaskById(taskId, userId);

        task.status = input.status;
        await task.save();

        logger.info('Task status updated', { taskId: task._id, userId, status: input.status });

        return task;
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string, userId: string): Promise<void> {
        const task = await this.getTaskById(taskId, userId);

        await task.deleteOne();

        logger.info('Task deleted', { taskId, userId });
    }
}

export default new TaskService();
