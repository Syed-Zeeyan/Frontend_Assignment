import rateLimit from 'express-rate-limit';
import config from '../config/config';
import { HTTP_STATUS } from '../config/constants';

export const rateLimiter = rateLimit({
    windowMs: config.rate_limit.window_ms,
    max: config.rate_limit.max_requests,
    message: {
        success: false,
        error: {
            message: 'Too many requests from this IP, please try again later',
        },
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS || 429,
});

// Stricter rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        error: {
            message: 'Too many authentication attempts, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});
