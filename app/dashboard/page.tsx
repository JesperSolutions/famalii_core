import { requireAuth } from '@/lib/auth/requireAuth'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { getAppSwitcherData } from '@/lib/appSwitcher'
import { AppSwitcher } from '@/components/AppSwitcher'

export default async function DashboardPage() {
  const userId = await requireAuth()
  const [user, apps] = await Promise.all([
    getCurrentUser(),
    getAppSwitcherData(userId),
  ])

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
      </h1>
      <p className="text-gray-500 mb-8">
        Here is your Famalii workspace. Launch an app or add a new one.
      </p>
      <AppSwitcher apps={apps} />
    </div>
  )
}
