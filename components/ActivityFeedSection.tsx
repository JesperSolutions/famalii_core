import { prisma } from '@/lib/db'

function formatAction(action: string, appSlug: string | null): string {
  switch (action) {
    case 'user.created': return 'Account created'
    case 'user.updated': return 'Profile updated'
    case 'user.deleted': return 'Account closed'
    case 'app.joined': {
      if (!appSlug) return 'Joined an app'
      const pretty = appSlug
        .replace('famalii-', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      return `Joined Famalii ${pretty}`
    }
    default: return action.replace(/\./g, ' ')
  }
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const ACTION_ICON: Record<string, { bg: string; icon: string }> = {
  'user.created': { bg: 'bg-emerald-500/10 border-emerald-500/20', icon: 'text-emerald-400' },
  'user.updated': { bg: 'bg-blue-500/10 border-blue-500/20',       icon: 'text-blue-400'   },
  'app.joined':   { bg: 'bg-f-orange/10 border-f-orange/20',       icon: 'text-f-orange'   },
}

export async function ActivityFeedSection({ userId }: { userId: string }) {
  const entries = await prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: { id: true, action: true, appSlug: true, createdAt: true },
  })

  if (entries.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-lg font-bold text-f-text mb-6">Recent activity</h2>
      <div className="rounded-2xl border border-f-border overflow-hidden divide-y divide-f-border">
        {entries.map((e) => {
          const style = ACTION_ICON[e.action] ?? { bg: 'bg-f-raised border-f-border', icon: 'text-f-faint' }
          return (
            <div
              key={e.id}
              className="flex items-center justify-between px-5 py-4 bg-f-surface hover:bg-f-raised transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={style.icon}>
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-f-text font-medium">
                  {formatAction(e.action, e.appSlug)}
                </span>
              </div>
              <span className="text-xs text-f-faint tabular-nums shrink-0 ml-4">
                {relativeTime(e.createdAt)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
