import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
            <div className="text-center text-white space-y-6">
                <h1 className="text-5xl font-bold mb-4">Task Management</h1>
                <p className="text-xl text-primary-100 mb-8">
                    Organize your tasks efficiently
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold border-2 border-white hover:bg-primary-700 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
}
