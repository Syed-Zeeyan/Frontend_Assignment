import { Task } from '@/lib/api/task.api';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onStatusChange?: (taskId: string, status: Task['status']) => void;
}

const statusConfig = {
    pending: { label: 'To Do', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    completed: { label: 'Done', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
};

const priorityConfig = {
    low: { label: 'Low', color: 'text-gray-500' },
    medium: { label: 'Medium', color: 'text-yellow-500' },
    high: { label: 'High', color: 'text-red-500' },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const status = statusConfig[task.status];
    const priority = task.priority ? priorityConfig[task.priority] : null;

    return (
        <div
            className="
                group relative p-4 rounded-xl border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800
                shadow-sm hover:shadow-md
                transition-all duration-200
                hover:-translate-y-1
            "
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {task.title}
                </h3>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        aria-label="Edit task"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        aria-label="Delete task"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {/* Status badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                    </span>

                    {/* Priority indicator */}
                    {priority && (
                        <span className={`text-xs font-medium ${priority.color}`}>
                            {priority.label}
                        </span>
                    )}
                </div>

                {/* Due date */}
                {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {/* Created date (subtle) */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="h-3 w-3" />
                    Created {new Date(task.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
