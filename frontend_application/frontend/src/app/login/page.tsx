'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { validateEmail } from '@/lib/utils/validation';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setApiError('');
    };

    const validate = (): boolean => {
        const emailError = validateEmail(formData.email);
        const passwordError = formData.password ? null : 'Password is required';

        setErrors({
            email: emailError || '',
            password: passwordError || '',
        });

        return !emailError && !passwordError;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setApiError('');

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: { message?: string } } } };
            const message =
                err.response?.data?.error?.message ||
                'Login failed. Please check your credentials.';
            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
                </div>

                {/* Error Alert */}
                {apiError && (
                    <Alert type="error" message={apiError} onClose={() => setApiError('')} />
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            disabled={isLoading}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-700"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Sign in
                    </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
