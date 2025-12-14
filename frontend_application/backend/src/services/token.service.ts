import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AuthenticationError } from '../utils/errors';
import { ERROR_MESSAGES } from '../config/constants';

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

class TokenService {
    /**
     * Generate JWT access token
     */
    generateAccessToken(payload: JWTPayload): string {
        return jwt.sign(payload, config.jwt.access_secret, {
            expiresIn: config.jwt.access_expire as string,
            issuer: 'task-management-api',
        } as jwt.SignOptions);
    }

    /**
     * Generate JWT refresh token
     */
    generateRefreshToken(payload: JWTPayload): string {
        return jwt.sign(payload, config.jwt.refresh_secret, {
            expiresIn: config.jwt.refresh_expire as string,
            issuer: 'task-management-api',
        } as jwt.SignOptions);
    }

    /**
     * Generate both access and refresh tokens
     */
    generateTokenPair(payload: JWTPayload): TokenPair {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, config.jwt.access_secret) as JWTPayload;
            return decoded;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
        }
    }

    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): JWTPayload {
        try {
            const decoded = jwt.verify(token, config.jwt.refresh_secret) as JWTPayload;
            return decoded;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new AuthenticationError(ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    decodeToken(token: string): JWTPayload | null {
        try {
            return jwt.decode(token) as JWTPayload;
        } catch (error) {
            return null;
        }
    }
}

export default new TokenService();
