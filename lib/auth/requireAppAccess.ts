import { notFound } from 'next/navigation'
import { requireAuth } from './requireAuth'
import { prisma } from '@/lib/db'
import type { UserAppMembership, App } from '@prisma/client'

export type MembershipWithApp = UserAppMembership & { app: App }

/**
 * Asserts that the current user is authenticated AND has an active membership
 * in the given app (identified by slug). Calls notFound() if either check fails,
 * so the user sees a 404 rather than an auth error leaking app existence.
 */
export async function requireAppAccess(appSlug: string): Promise<MembershipWithApp> {
  const userId = await requireAuth()

  const membership = await prisma.userAppMembership.findFirst({
    where: {
      userId,
      app: { slug: appSlug, isActive: true },
    },
    include: { app: true },
  })

  if (!membership) notFound()
  return membership
}
