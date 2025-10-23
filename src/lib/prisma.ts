import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client シングルトンインスタンス
 * 開発中に複数のインスタンスが作成されるのを防ぐ
 */
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
