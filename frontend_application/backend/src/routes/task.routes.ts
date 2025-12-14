import { Router } from 'express';
import taskController from '../controllers/task.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import {
    createTaskSchema,
    updateTaskSchema,
    updateTaskStatusSchema,
    getTaskSchema,
    getTasksQuerySchema,
} from '../validators/task.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with pagination and filters
 * @access  Private
 */
router.get('/', validate(getTasksQuerySchema), taskController.getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', validate(getTaskSchema), taskController.getTask);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', validate(createTaskSchema), taskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private
 */
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status only
 * @access  Private
 */
router.patch(
    '/:id/status',
    validate(updateTaskStatusSchema),
    taskController.updateTaskStatus
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', validate(getTaskSchema), taskController.deleteTask);

export default router;
