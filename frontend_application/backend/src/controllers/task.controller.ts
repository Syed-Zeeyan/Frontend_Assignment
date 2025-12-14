import { Request, Response, NextFunction } from 'express';
import taskService from '../services/task.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants';
import {
    CreateTaskInput,
    UpdateTaskInput,
    UpdateTaskStatusInput,
    GetTasksQuery,
} from '../validators/task.validator';

class TaskController {
    /**
     * Get all tasks with pagination and filters
     * GET /api/tasks
     */
    async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const query: GetTasksQuery = req.query;

            const result = await taskService.getTasks(userId, query);

            sendSuccess(res, result, undefined, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get single task by ID
     * GET /api/tasks/:id
     */
    async getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { id } = req.params;

            const task = await taskService.getTaskById(id, userId);

            sendSuccess(res, { task }, undefined, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new task
     * POST /api/tasks
     */
    async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const input: CreateTaskInput = req.body;

            const task = await taskService.createTask(userId, input);

            sendSuccess(res, { task }, SUCCESS_MESSAGES.TASK_CREATED, HTTP_STATUS.CREATED);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a task
     * PUT /api/tasks/:id
     */
    async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { id } = req.params;
            const input: UpdateTaskInput = req.body;

            const task = await taskService.updateTask(id, userId, input);

            sendSuccess(res, { task }, SUCCESS_MESSAGES.TASK_UPDATED, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update task status
     * PATCH /api/tasks/:id/status
     */
    async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { id } = req.params;
            const input: UpdateTaskStatusInput = req.body;

            const task = await taskService.updateTaskStatus(id, userId, input);

            sendSuccess(res, { task }, SUCCESS_MESSAGES.TASK_UPDATED, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a task
     * DELETE /api/tasks/:id
     */
    async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!._id.toString();
            const { id } = req.params;

            await taskService.deleteTask(id, userId);

            sendSuccess(res, null, SUCCESS_MESSAGES.TASK_DELETED, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }
}

export default new TaskController();
