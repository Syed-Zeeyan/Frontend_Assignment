import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config/config';
import connectDatabase from './config/database';
import logger from './utils/logger';

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Start Express server
        const server = app.listen(config.port, () => {
            logger.info(`Server running in ${config.node_env} mode on port ${config.port}`);
            logger.info(`API available at http://localhost:${config.port}/api`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forcefully shutting down after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: any) => {
            logger.error('Unhandled Rejection:', reason);
            process.exit(1);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
