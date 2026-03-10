import { requireAuth } from '@/lib/auth/requireAuth'
import { getAppSwitcherData } from '@/lib/appSwitcher'
import { AppSwitcher } from '@/components/AppSwitcher'

export default async function AppsPage() {
  const userId = await requireAuth()
  const apps = await getAppSwitcherData(userId)

  const joinedCount = apps.filter(a => a.joined).length

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-2">
          App catalogue
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-f-text mb-2 tracking-tight">
          Famalii Apps
        </h1>
        <p className="text-f-muted">
          {joinedCount === 0
            ? 'Browse the full catalogue and add apps to your workspace.'
            : `You've joined ${joinedCount} app${joinedCount > 1 ? 's' : ''}. Add more below.`}
        </p>
      </div>

      <AppSwitcher apps={apps} />
    </div>
  )
}
