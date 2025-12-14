import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants';
import { RegisterInput, LoginInput, RefreshTokenInput } from '../validators/auth.validator';

class AuthController {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: RegisterInput = req.body;
            const result = await authService.register(input);

            sendSuccess(res, result, SUCCESS_MESSAGES.REGISTER_SUCCESS, HTTP_STATUS.CREATED);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: LoginInput = req.body;
            const result = await authService.login(input);

            sendSuccess(res, result, SUCCESS_MESSAGES.LOGIN_SUCCESS, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Refresh access token
     * POST /api/auth/refresh
     */
    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken }: RefreshTokenInput = req.body;
            const result = await authService.refreshAccessToken(refreshToken);

            sendSuccess(res, result, undefined, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile
     * GET /api/auth/me
     */
    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // User is attached to request by auth middleware
            const userId = req.user!._id.toString();
            const user = await authService.getUserProfile(userId);

            sendSuccess(res, { user }, undefined, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // In a production system, you would:
            // 1. Blacklist the token in Redis
            // 2. Clear any server-side sessions
            // For now, we'll just send a success response
            // Client should remove tokens from storage

            sendSuccess(res, null, SUCCESS_MESSAGES.LOGOUT_SUCCESS, HTTP_STATUS.OK);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
