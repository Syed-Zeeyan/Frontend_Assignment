'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="pointer-events-auto"
                        >
                            <ToastCard
                                type={toast.type}
                                message={toast.message}
                                onClose={() => removeToast(toast.id)}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastCard({ type, message, onClose }: { type: ToastType; message: string; onClose: () => void }) {
    const config = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-500 dark:border-green-400',
            iconColor: 'text-green-600 dark:text-green-400',
            textColor: 'text-green-900 dark:text-green-100',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-500 dark:border-red-400',
            iconColor: 'text-red-600 dark:text-red-400',
            textColor: 'text-red-900 dark:text-red-100',
        },
        info: {
            icon: AlertCircle,
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-500 dark:border-blue-400',
            iconColor: 'text-blue-600 dark:text-blue-400',
            textColor: 'text-blue-900 dark:text-blue-100',
        },
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                ${bgColor} border-l-4 ${borderColor}
                shadow-lg backdrop-blur-sm
                min-w-[300px] max-w-[400px]
            `}
        >
            <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
            <p className={`text-sm font-medium ${textColor} flex-1`}>{message}</p>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
                <X className="h-4 w-4 text-gray-500" />
            </button>
        </div>
    );
}
