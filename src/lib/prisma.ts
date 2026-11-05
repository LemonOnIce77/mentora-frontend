if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

let prismaClient: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClient;
} catch (err) {
  console.warn('[Prisma] Client runtime unavailable, using fallback mock:', err);
}

// Proxy agar jika prismaClient belum ter-generate di mesin lokal anggota tim,
// pemanggilan model (seperti prisma.user.findUnique) tidak me-raise crash di level modul,
// melainkan melempar promise rejection yang aman ditangkap oleh blok catch(dbError).
export const prisma: any = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prismaClient && prismaClient[prop]) {
        return prismaClient[prop];
      }
      return new Proxy(
        {},
        {
          get(_modelTarget, method) {
            return async () => {
              throw new Error(`Prisma.${String(prop)}.${String(method)} not ready`);
            };
          },
        }
      );
    },
  }
);
