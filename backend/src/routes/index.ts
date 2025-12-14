import { Router } from 'express';
import authRoutes from './auth.routes';
import taskRoutes from './task.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

// Health check endpoint
router.get('/health', (_req, _res) => {
    _res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
    });
});

export default router;
