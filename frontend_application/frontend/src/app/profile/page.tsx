'use client';

import { DashboardLayout } from '@/components/layout';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, LogOut, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleSaveName = () => {
        // TODO: Call API to update name
        setIsEditingName(false);
    };

    const handleSaveEmail = () => {
        // TODO: Call API to update email
        setIsEditingEmail(false);
    };

    const handleCancelName = () => {
        setName(user?.name || '');
        setIsEditingName(false);
    };

    const handleCancelEmail = () => {
        setEmail(user?.email || '');
        setIsEditingEmail(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account settings and personal information
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all">
                                    <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="
                                                    flex-1 px-4 py-2 rounded-lg
                                                    border border-gray-300 dark:border-gray-600
                                                    bg-white dark:bg-gray-900
                                                    text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-purple-500
                                                "
                                            />
                                            <button
                                                onClick={handleSaveName}
                                                className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={handleCancelName}
                                                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {user?.name || 'User Name'}
                                            </span>
                                            <button
                                                onClick={() => setIsEditingName(true)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    {isEditingEmail ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="
                                                    flex-1 px-4 py-2 rounded-lg
                                                    border border-gray-300 dark:border-gray-600
                                                    bg-white dark:bg-gray-900
                                                    text-gray-900 dark:text-gray-100
                                                    focus:outline-none focus:ring-2 focus:ring-purple-500
                                                "
                                            />
                                            <button
                                                onClick={handleSaveEmail}
                                                className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                                            >
                                                <Check className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={handleCancelEmail}
                                                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {user?.email || 'user@example.com'}
                                            </span>
                                            <button
                                                onClick={() => setIsEditingEmail(true)}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Account Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        User ID
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        {user?.id || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Status
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Verified
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Member Since
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                            Danger Zone
                        </h2>
                        <button
                            onClick={handleLogout}
                            className="
                                flex items-center gap-2 px-6 py-3 rounded-lg
                                bg-red-600 hover:bg-red-700
                                text-white font-medium
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                hover:-translate-y-0.5
                            "
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
