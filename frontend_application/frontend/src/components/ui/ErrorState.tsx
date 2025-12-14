import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showRetry?: boolean;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'We encountered an error while loading this page. Please try again.',
    onRetry,
    showRetry = true,
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                {message}
            </p>

            {showRetry && onRetry && (
                <Button onClick={onRetry} variant="primary">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}

// API Error variant
export function ApiErrorState({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorState
            title="Failed to load data"
            message="We couldn't connect to the server. Please check your internet connection and try again."
            onRetry={onRetry}
        />
    );
}

// Network Error variant
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
    return (
        <ErrorState
            title="Connection lost"
            message="It seems you're offline. Please check your internet connection and try again."
            onRetry={onRetry}
        />
    );
}
