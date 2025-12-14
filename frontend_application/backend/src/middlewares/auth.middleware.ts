import { Request, Response, NextFunction } from 'express';
import tokenService from '../services/token.service';
import User from '../models/User.model';
import { AuthenticationError } from '../utils/errors';
import { ERROR_MESSAGES } from '../config/constants';

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError(ERROR_MESSAGES.TOKEN_MISSING);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = tokenService.verifyAccessToken(token);

        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AuthenticationError(ERROR_MESSAGES.UNAUTHORIZED);
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
