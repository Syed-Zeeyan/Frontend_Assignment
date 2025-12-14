'use client';

import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, taskTitle }: DeleteConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>

                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Delete Task?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to delete &quot;<span className="font-medium text-gray-900 dark:text-gray-100">{taskTitle}</span>&quot;? This action cannot be undone.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="
                                flex-1 px-4 py-2.5 rounded-lg font-medium
                                border border-gray-300 dark:border-gray-600
                                text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-gray-700
                                transition-colors duration-200
                            "
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="
                                flex-1 px-4 py-2.5 rounded-lg font-medium
                                bg-red-600 hover:bg-red-700
                                text-white
                                transition-colors duration-200
                            "
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
