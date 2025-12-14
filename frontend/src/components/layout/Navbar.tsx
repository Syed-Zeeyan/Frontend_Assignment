'use client';

import { Bell, Search, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="h-full px-6 flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="
                                w-full pl-10 pr-4 py-2 rounded-lg
                                bg-gray-100 dark:bg-gray-800
                                border border-transparent
                                text-gray-900 dark:text-gray-100
                                placeholder:text-gray-500 dark:placeholder:text-gray-400
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-200
                            "
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="
                            p-2 rounded-lg text-gray-700 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            transition-all duration-200
                        "
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* Notifications */}
                    <button
                        className="
                            relative p-2 rounded-lg text-gray-700 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-800
                            transition-all duration-200
                        "
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="
                                flex items-center gap-2 p-2 rounded-lg
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                transition-all duration-200
                            "
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user?.name || 'User'}
                            </span>
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div
                                    className="
                                        absolute right-0 mt-2 w-56 z-20
                                        bg-white dark:bg-gray-800
                                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700
                                        py-1 animate-in fade-in slide-in-from-top-2 duration-200
                                    "
                                >
                                    {/* User info */}
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>

                                    {/* Menu items */}
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            router.push('/profile');
                                        }}
                                        className="
                                            w-full flex items-center gap-2 px-4 py-2
                                            text-sm text-gray-700 dark:text-gray-300
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                            transition-colors duration-150
                                        "
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            router.push('/settings');
                                        }}
                                        className="
                                            w-full flex items-center gap-2 px-4 py-2
                                            text-sm text-gray-700 dark:text-gray-300
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                            transition-colors duration-150
                                        "
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </button>

                                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="
                                            w-full flex items-center gap-2 px-4 py-2
                                            text-sm text-red-600 dark:text-red-400
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                            transition-colors duration-150
                                        "
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
