interface Config {
    node_env: string;
    port: number;
    mongodb_uri: string;
    jwt: {
        access_secret: string;
        refresh_secret: string;
        access_expire: string;
        refresh_expire: string;
    };
    bcrypt_rounds: number;
    cors_origin: string;
    rate_limit: {
        window_ms: number;
        max_requests: number;
    };
}

const config: Config = {
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mongodb_uri: process.env.MONGODB_URI || '',
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production',
        refresh_secret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
        access_expire: process.env.JWT_ACCESS_EXPIRE || '15m',
        refresh_expire: process.env.JWT_REFRESH_EXPIRE || '7d',
    },
    bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    rate_limit: {
        window_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        max_requests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
};

// Validate critical configuration
if (!config.mongodb_uri) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables! Check your .env file.');
}

if (config.node_env === 'production') {
    if (
        config.jwt.access_secret.includes('default') ||
        config.jwt.refresh_secret.includes('default')
    ) {
        throw new Error('Production environment requires custom JWT secrets!');
    }
}

export default config;
