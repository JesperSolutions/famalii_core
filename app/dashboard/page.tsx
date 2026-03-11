import { Suspense } from 'react'
import { requireAuth } from '@/lib/auth/requireAuth'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { AppsSection, AppsSkeleton } from '@/components/AppsSection'
import { ActivityFeedSection } from '@/components/ActivityFeedSection'

export default async function DashboardPage() {
  const userId = await requireAuth()
  const user = await getCurrentUser()
  const displayName = user?.firstName ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* ── Page header — renders immediately ──────────────── */}
      <div className="mb-2">
        <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-2">
          Your workspace
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-f-text tracking-tight">
          Welcome back, {displayName}
        </h1>
      </div>

      {/* ── Apps section (subtitle + quick-launch + stats + grid) streams in ── */}
      <Suspense fallback={<AppsSkeleton />}>
        <AppsSection userId={userId} />
      </Suspense>

      {/* ── Activity feed streams in independently ──────────── */}
      <Suspense fallback={<div className="mt-16 h-40 rounded-2xl border border-f-border bg-f-surface animate-pulse" />}>
        <ActivityFeedSection userId={userId} />
      </Suspense>
    </div>
  )
}
