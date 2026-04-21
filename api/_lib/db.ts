import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __jobTrackerPrisma__: PrismaClient | undefined
}

export const db =
  globalThis.__jobTrackerPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__jobTrackerPrisma__ = db
}

