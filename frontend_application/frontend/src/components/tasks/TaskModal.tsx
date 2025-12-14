'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/api/task.api';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
    task?: Task;
}

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
    const [formData, setFormData] = useState<CreateTaskInput>({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="
                                w-full px-4 py-2.5 rounded-lg
                                border border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-900
                                text-gray-900 dark:text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-200
                            "
                            placeholder="Enter task title..."
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="
                                w-full px-4 py-2.5 rounded-lg
                                border border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-900
                                text-gray-900 dark:text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-200
                                resize-none
                            "
                            placeholder="Add description..."
                        />
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                                className="
                                    w-full px-4 py-2.5 rounded-lg
                                    border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-900
                                    text-gray-900 dark:text-gray-100
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                    transition-all duration-200
                                "
                            >
                                <option value="pending">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                                className="
                                    w-full px-4 py-2.5 rounded-lg
                                    border border-gray-300 dark:border-gray-600
                                    bg-white dark:bg-gray-900
                                    text-gray-900 dark:text-gray-100
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                    transition-all duration-200
                                "
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="
                                w-full px-4 py-2.5 rounded-lg
                                border border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-900
                                text-gray-900 dark:text-gray-100
                                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                transition-all duration-200
                            "
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
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
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                flex-1 px-4 py-2.5 rounded-lg font-medium
                                bg-purple-600 hover:bg-purple-700
                                text-white
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-colors duration-200
                            "
                        >
                            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
