import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'

/**
 * Joins a user to a Famalii app with the default MEMBER role.
 * Idempotent: calling it twice for the same user+app returns the existing membership.
 * Throws if the app does not exist or is inactive.
 */
export async function joinAppForUser(userId: string, appSlug: string) {
  const app = await prisma.app.findUnique({
    where: { slug: appSlug, isActive: true },
  })

  if (!app) throw new Error(`App "${appSlug}" not found or is inactive`)

  const membership = await prisma.userAppMembership.upsert({
    where: { userId_appId: { userId, appId: app.id } },
    create: { userId, appId: app.id, role: Role.MEMBER },
    update: {}, // already a member — no changes
    include: { app: true },
  })

  // Append audit entry only on first join
  if (membership.joinedAt.getTime() === membership.updatedAt.getTime()) {
    await prisma.auditLog.create({
      data: {
        userId,
        appSlug,
        action: 'app.joined',
        metadata: { appId: app.id, role: Role.MEMBER },
      },
    })
  }

  return membership
}
