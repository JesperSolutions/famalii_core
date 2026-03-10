import { requireAuth } from '@/lib/auth/requireAuth'
import { getAppSwitcherData } from '@/lib/appSwitcher'
import { AppSwitcher } from '@/components/AppSwitcher'

export default async function AppsPage() {
  const userId = await requireAuth()
  const apps = await getAppSwitcherData(userId)

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Famalii Apps</h1>
      <p className="text-gray-500 mb-8">
        Browse all available apps. Click &quot;Add to my Famalii&quot; to join one.
      </p>
      <AppSwitcher apps={apps} />
    </div>
  )
}
