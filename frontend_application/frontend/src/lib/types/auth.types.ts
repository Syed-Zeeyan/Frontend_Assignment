export interface User {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        tokens: AuthTokens;
    };
    message?: string;
}

export interface ApiError {
    success: false;
    error: {
        message: string;
        details?: unknown;
    };
}
