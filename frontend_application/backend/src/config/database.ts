import mongoose from 'mongoose';
import config from './config';
import logger from '../utils/logger';

const connectDatabase = async (): Promise<void> => {
    try {
        const options = {
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
        };

        // Diagnostic: Log the MongoDB URI being used
        console.log('🔍 MONGO URI USED 👉', config.mongodb_uri);

        await mongoose.connect(config.mongodb_uri, options);

        logger.info('MongoDB connected successfully', {
            host: mongoose.connection.host,
            database: mongoose.connection.name,
        });

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDatabase;
