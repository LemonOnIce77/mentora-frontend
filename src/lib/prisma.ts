import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    } catch {
      // Return a dummy object if Prisma Client hasn't been generated
      return new Proxy({} as PrismaClient, {
        get: () => () => {
          throw new Error('@prisma/client did not initialize yet. Please run "prisma generate" or configure your database.');
        },
      });
    }
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
