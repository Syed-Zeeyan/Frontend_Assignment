import { apiClient } from './client';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
} from '../types/auth.types';

export const authApi = {
    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/register', data);
    },

    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/login', data);
    },

    /**
     * Get current user profile
     */
    getMe: async (): Promise<{ success: boolean; data: { user: User } }> => {
        return apiClient.get('/auth/me');
    },

    /**
     * Logout user
     */
    logout: async (): Promise<{ success: boolean }> => {
        return apiClient.post('/auth/logout');
    },

    /**
     * Refresh access token
     */
    refreshToken: async (refreshToken: string): Promise<{ success: boolean; data: { accessToken: string } }> => {
        return apiClient.post('/auth/refresh', { refreshToken });
    },
};
