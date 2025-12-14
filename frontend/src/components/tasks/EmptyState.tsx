import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-6">
                <FileQuestion className="w-12 h-12 text-purple-500 dark:text-purple-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No tasks yet
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                Get started by creating your first task. Organize your work and stay productive!
            </p>

            <button
                onClick={onCreateTask}
                className="
                    px-6 py-2.5 rounded-lg font-medium
                    bg-purple-600 hover:bg-purple-700
                    text-white
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                    hover:-translate-y-0.5
                "
            >
                Create Your First Task
            </button>
        </div>
    );
}
