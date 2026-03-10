import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Prevent multiple PrismaClient instances in development (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof makePrisma> }

function makePrisma() {
  return new PrismaClient().$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? makePrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
