import { prisma } from '@/lib/db'

/**
 * Removes a user's membership from a Famalii app.
 * Silent no-op if the membership doesn't exist (already left).
 * Throws if the app does not exist or is the protected famalii-core slug.
 */
export async function leaveAppForUser(userId: string, appSlug: string) {
  // Core is the host app — users can never leave it
  if (appSlug === 'famalii-core') {
    throw new Error('You cannot remove Famalii Core.')
  }

  const app = await prisma.app.findUnique({
    where: { slug: appSlug },
  })

  if (!app) throw new Error(`App "${appSlug}" not found`)

  await prisma.$transaction([
    prisma.userAppMembership.deleteMany({
      where: { userId, appId: app.id },
    }),
    prisma.auditLog.create({
      data: {
        userId,
        appSlug,
        action: 'app.left',
        metadata: { appId: app.id, appName: app.name },
      },
    }),
  ])
}
