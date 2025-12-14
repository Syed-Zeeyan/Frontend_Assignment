import User, { IUser } from '../models/User.model';
import tokenService from './token.service';
import { ConflictError, AuthenticationError, NotFoundError } from '../utils/errors';
import { ERROR_MESSAGES } from '../config/constants';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import logger from '../utils/logger';

interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

class AuthService {
    /**
     * Register a new user
     */
    async register(input: RegisterInput): Promise<AuthResponse> {
        const { name, email, password } = input;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS);
        }

        // Create new user (password will be hashed automatically by pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
        });

        logger.info('New user registered', { userId: user._id, email: user.email });

        // Generate JWT tokens
        const tokens = tokenService.generateTokenPair({
            userId: user._id.toString(),
            email: user.email,
        });

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
            tokens,
        };
    }

    /**
     * Login user
     */
    async login(input: LoginInput): Promise<AuthResponse> {
        const { email, password } = input;

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        logger.info('User logged in', { userId: user._id, email: user.email });

        // Generate JWT tokens
        const tokens = tokenService.generateTokenPair({
            userId: user._id.toString(),
            email: user.email,
        });

        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
            tokens,
        };
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        // Verify refresh token
        const decoded = tokenService.verifyRefreshToken(refreshToken);

        // Verify user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        // Generate new access token
        const accessToken = tokenService.generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
        });

        logger.info('Access token refreshed', { userId: user._id });

        return { accessToken };
    }

    /**
     * Get user profile by ID
     */
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        return user;
    }
}

export default new AuthService();
