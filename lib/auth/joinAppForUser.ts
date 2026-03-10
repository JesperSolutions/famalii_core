import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

/**
 * Joins a user to a Famalii app with the default MEMBER role.
 * Idempotent: calling it twice for the same user+app returns the existing membership.
 * Throws if the app does not exist or is inactive.
 */
export async function joinAppForUser(userId: string, appSlug: string) {
  // Ensure the User row exists before we try to create a FK-linked membership.
  // Clerk webhooks may not have fired yet (dev env / first sign-in), so we
  // sync the user on-demand here with a safe upsert.
  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(userId)
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@unknown`

  await prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
    update: {
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      imageUrl: clerkUser.imageUrl ?? null,
    },
  })

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
