import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface GenericEmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function GenericEmptyState({
    icon,
    title,
    message,
    actionLabel,
    onAction,
}: GenericEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                {icon || <Inbox className="w-10 h-10 text-gray-400" />}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                {message}
            </p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
