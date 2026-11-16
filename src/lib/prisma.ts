import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Serverless SQLite initialization for Vercel / Lambda
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('/tmp/')) {
  try {
    const targetFile = '/tmp/dev.db';
    if (!fs.existsSync(targetFile)) {
      const seedFile = path.join(process.cwd(), 'prisma', 'seed.db');
      if (fs.existsSync(seedFile)) {
        fs.copyFileSync(seedFile, targetFile);
      }
    }
  } catch (err) {
    console.error('Error initializing serverless SQLite DB in /tmp:', err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
