import { Suspense } from 'react'
import { requireAuth } from '@/lib/auth/requireAuth'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { AppsSection, AppsSkeleton } from '@/components/AppsSection'
import { ActivityFeedSection } from '@/components/ActivityFeedSection'
import { AppFeedSection, AppFeedSkeleton } from '@/components/AppFeedSection'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const userId = await requireAuth()
  const user = await getCurrentUser()
  const displayName = user?.firstName ?? user?.email?.split('@')[0] ?? 'there'

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ── Hero header ───────────────────────────────────── */}
      <div className="relative mb-12 rounded-3xl border border-f-border bg-f-surface overflow-hidden px-8 py-10">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-f-orange/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-3">
            {dateStr}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-f-text tracking-tight mb-2">
            {getGreeting()}, {displayName}
          </h1>
          <p className="text-sm text-f-muted">Here's an overview of your Famalii workspace.</p>
        </div>
      </div>

      {/* ── Apps section streams in ──────────────────────── */}
      <Suspense fallback={<AppsSkeleton />}>
        <AppsSection userId={userId} />
      </Suspense>

      {/* ── App updates feed streams in ──────────────────────────── */}
      <Suspense fallback={<AppFeedSkeleton />}>
        <AppFeedSection userId={userId} />
      </Suspense>

      {/* ── Activity log streams in ──────────────────────────────── */}
      <Suspense fallback={<div className="mt-14 h-40 rounded-2xl border border-f-border bg-f-surface animate-pulse" />}>
        <ActivityFeedSection userId={userId} />
      </Suspense>
    </div>
  )
}
