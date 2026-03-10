import { prisma } from '@/lib/db'
import type { Role } from '@prisma/client'

export type AppWithMembershipStatus = {
  id: string
  slug: string
  name: string
  description: string
  iconUrl: string | null
  launchUrl: string
  isActive: boolean
  joined: boolean
  role: Role | null
}

/**
 * Returns every active Famalii app with a flag indicating whether the given
 * user has joined it, plus their role if they have.
 */
export async function listAvailableAppsForUser(
  userId: string,
): Promise<AppWithMembershipStatus[]> {
  const [apps, memberships] = await Promise.all([
    prisma.app.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.userAppMembership.findMany({
      where: { userId },
      select: { appId: true, role: true },
    }),
  ])

  const membershipMap = new Map(memberships.map((m) => [m.appId, m.role]))

  return apps.map((app) => ({
    ...app,
    joined: membershipMap.has(app.id),
    role: membershipMap.get(app.id) ?? null,
  }))
}
