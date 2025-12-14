import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface UnauthorizedStateProps {
    title?: string;
    message?: string;
    showBackButton?: boolean;
    showLoginButton?: boolean;
}

export function UnauthorizedState({
    title = 'Access Denied',
    message = "You don&apos;t have permission to view this page. Please log in or contact your administrator.",
    showBackButton = true,
    showLoginButton = true,
}: UnauthorizedStateProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-6">
                <ShieldAlert className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                {message}
            </p>

            <div className="flex gap-3">
                {showBackButton && (
                    <Button onClick={() => router.back()} variant="secondary">
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>
                )}
                {showLoginButton && (
                    <Button onClick={() => router.push('/login')} variant="primary">
                        Login
                    </Button>
                )}
            </div>
        </div>
    );
}

// 404 Not Found variant
export function NotFoundState() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
            <div className="text-8xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                404
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Page Not Found
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <div className="flex gap-3">
                <Button onClick={() => router.back()} variant="secondary">
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="primary">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
}
