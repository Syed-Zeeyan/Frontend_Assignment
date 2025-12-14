'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { syncAuthToCookie } from '../utils/cookies';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = storage.getToken();
            const storedUser = storage.getUser();

            if (token && storedUser) {
                setUser(storedUser);
                // Sync to cookie for middleware
                syncAuthToCookie(true);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        const { user, tokens } = response.data;

        // Store tokens and user
        storage.setToken(tokens.accessToken);
        storage.setRefreshToken(tokens.refreshToken);
        storage.setUser(user);

        setUser(user);

        // Sync to cookie for middleware
        syncAuthToCookie(true);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        const { user, tokens } = response.data;

        // Store tokens and user
        storage.setToken(tokens.accessToken);
        storage.setRefreshToken(tokens.refreshToken);
        storage.setUser(user);

        setUser(user);

        // Sync to cookie for middleware
        syncAuthToCookie(true);
    };

    const logout = () => {
        storage.clear();
        setUser(null);

        // Clear cookie for middleware
        syncAuthToCookie(false);
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
