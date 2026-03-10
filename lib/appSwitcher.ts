import { cache } from 'react'
import { listAvailableAppsForUser } from './auth/listAvailableAppsForUser'
import type { Role } from '@prisma/client'

export type AppSwitcherItem = {
  name: string
  slug: string
  description: string
  iconPlaceholder: string // first capital letter of the app name
  joined: boolean
  role: Role | null
  launchUrl: string
  isActive: boolean
}

/**
 * Returns a combined data structure suitable for rendering an App Switcher menu.
 * Each entry includes join status and role so the UI can grey out unjoined apps.
 * Wrapped in React.cache() so multiple server components in the same render pass
 * share one DB round-trip.
 */
export const getAppSwitcherData = cache(async (userId: string): Promise<AppSwitcherItem[]> => {
  const apps = await listAvailableAppsForUser(userId)

  return apps.map((app) => ({
    name: app.name,
    slug: app.slug,
    description: app.description,
    iconPlaceholder: app.name.charAt(0).toUpperCase(),
    joined: app.joined,
    role: app.role,
    launchUrl: app.launchUrl,
    isActive: app.isActive,
  }))
})
