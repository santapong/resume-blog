import { PrismaClient } from '@prisma/client';

// Singleton: in serverless / dev-with-HMR, fresh PrismaClient instances
// per request would exhaust the database connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
