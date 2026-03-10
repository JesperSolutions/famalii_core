import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import type { User } from '@prisma/client'

/**
 * Returns the local DB User record for the currently signed-in Clerk user.
 * Returns null if unauthenticated or if the user hasn't been synced yet.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth()
  if (!userId) return null
  return prisma.user.findUnique({ where: { id: userId } })
}
