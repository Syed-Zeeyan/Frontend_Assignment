'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
    validateEmail,
    validatePassword,
    validateName,
} from '@/lib/utils/validation';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        let confirmPasswordError = '';
        if (!formData.confirmPassword) {
            confirmPasswordError = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            confirmPasswordError = 'Passwords do not match';
        }

        setErrors({
            name: nameError || '',
            email: emailError || '',
            password: passwordError || '',
            confirmPassword: confirmPasswordError,
        });

        return !nameError && !emailError && !passwordError && !confirmPasswordError;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        setApiError('');

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            router.push('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: { message?: string } } } };
            const message =
                err.response?.data?.error?.message ||
                'Registration failed. Please try again.';
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
                    <h2 className="auth-title">Create your account</h2>
                    <p className="auth-subtitle">Get started with your free account</p>
                </div>

                {/* Error Alert */}
                {apiError && (
                    <Alert type="error" message={apiError} onClose={() => setApiError('')} />
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Full name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="John Doe"
                            required
                            autoComplete="name"
                            disabled={isLoading}
                        />

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
                            autoComplete="new-password"
                            disabled={isLoading}
                        />

                        <Input
                            label="Confirm password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Password must contain:
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        formData.password.length >= 6
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                                >
                                    ✓
                                </span>
                                At least 6 characters
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        /[A-Z]/.test(formData.password)
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                                >
                                    ✓
                                </span>
                                One uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        /[a-z]/.test(formData.password)
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                                >
                                    ✓
                                </span>
                                One lowercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={
                                        /[0-9]/.test(formData.password)
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                                >
                                    ✓
                                </span>
                                One number
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-start">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{' '}
                            <Link
                                href="/terms"
                                className="font-medium text-primary-600 hover:text-primary-500"
                            >
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link
                                href="/privacy"
                                className="font-medium text-primary-600 hover:text-primary-500"
                            >
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Create account
                    </Button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-primary-600 hover:text-primary-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
