// Sync authentication state to cookies for middleware
export const syncAuthToCookie = (isAuthenticated: boolean): void => {
    if (typeof window === 'undefined') return;

    if (isAuthenticated) {
        // Set a simple flag cookie that middleware can read
        document.cookie = 'authenticated=true; path=/; max-age=604800'; // 7 days
    } else {
        // Clear the cookie
        document.cookie = 'authenticated=; path=/; max-age=0';
    }
};
