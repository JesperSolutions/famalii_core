import { prisma } from '@/lib/db'

function formatAction(action: string, appSlug: string | null): string {
  switch (action) {
    case 'user.created': return 'Account created'
    case 'user.updated': return 'Profile updated'
    case 'user.deleted': return 'Account closed'
    case 'app.joined': {
      if (!appSlug) return 'Joined an app'
      const pretty = appSlug.replace('famalii-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      return `Joined Famalii ${pretty}`
    }
    case 'app.left': {
      if (!appSlug) return 'Left an app'
      const pretty = appSlug.replace('famalii-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      return `Left Famalii ${pretty}`
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

const ACTION_STYLE: Record<string, { dot: string; bg: string; ring: string }> = {
  'user.created': { dot: 'bg-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-1 ring-emerald-500/20' },
  'user.updated': { dot: 'bg-blue-400',    bg: 'bg-blue-500/10',    ring: 'ring-1 ring-blue-500/20'    },
  'app.joined':   { dot: 'bg-f-orange',    bg: 'bg-f-orange/10',    ring: 'ring-1 ring-f-orange/20'    },
  'app.left':     { dot: 'bg-red-400',     bg: 'bg-red-500/10',     ring: 'ring-1 ring-red-500/20'     },
}

const APP_BADGE: Record<string, string> = {
  'famalii-invest': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'famalii-legal':  'bg-violet-500/10  text-violet-400  border-violet-500/20',
}

function getAppLabel(slug: string): string {
  return slug.replace('famalii-', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
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
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-f-text">Activity log</h2>
        <span className="text-xs text-f-faint bg-f-raised border border-f-border px-2.5 py-1 rounded-full">
          {entries.length} event{entries.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="rounded-2xl border border-f-border bg-f-surface overflow-hidden">
        <div className="relative">
          {/* Vertical timeline connector */}
          <div className="absolute left-[2.875rem] top-0 bottom-0 w-px bg-f-border pointer-events-none" aria-hidden />

          {entries.map((e, i) => {
            const s = ACTION_STYLE[e.action] ?? { dot: 'bg-f-faint', bg: 'bg-f-raised', ring: 'ring-1 ring-f-border' }
            return (
              <div
                key={e.id}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-f-raised/50 transition-colors ${
                  i < entries.length - 1 ? 'border-b border-f-border' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${s.bg} ${s.ring}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-f-text font-medium">{formatAction(e.action, e.appSlug)}</span>
                    {e.appSlug && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                        APP_BADGE[e.appSlug] ?? 'bg-f-raised text-f-faint border-f-border'
                      }`}>
                        {getAppLabel(e.appSlug)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-f-faint mt-0.5 tabular-nums">{relativeTime(e.createdAt)}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-5 py-3 border-t border-f-border bg-f-raised/40 flex items-center justify-between">
          <p className="text-xs text-f-faint">Showing last {entries.length} events</p>
          <p className="text-xs text-f-faint">Full audit log coming soon</p>
        </div>
      </div>
    </section>
  )
}
