import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client singleton instance
 * Prevents multiple instances in development due to hot-reloading
 */
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma Client on application shutdown
 */
export async function disconnectDatabase() {
    await prisma.$disconnect();
}

process.on('beforeExit', () => {
    void disconnectDatabase();
});
