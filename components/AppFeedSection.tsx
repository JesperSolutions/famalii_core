import { prisma } from '@/lib/db'

const APP_THEME: Record<string, { badge: string; dot: string; label: string }> = {
  'famalii-invest': {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot:   'bg-emerald-400',
    label: 'Invest',
  },
  'famalii-legal': {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dot:   'bg-violet-400',
    label: 'Legal',
  },
}

const CATEGORY_STYLE: Record<string, string> = {
  Feature:  'bg-sky-500/10     text-sky-400     border-sky-500/20',
  Fix:      'bg-amber-500/10  text-amber-400   border-amber-500/20',
  Security: 'bg-red-500/10    text-red-400     border-red-500/20',
  Legal:    'bg-violet-500/10 text-violet-400  border-violet-500/20',
  Market:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Update:   'bg-f-raised       text-f-faint     border-f-border',
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const mins  = Math.floor(diffMs / 60_000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export async function AppFeedSection({ userId }: { userId: string }) {
  // Resolve which apps the user has joined
  const memberships = await prisma.userAppMembership.findMany({
    where:  { userId },
    select: { app: { select: { slug: true } } },
  })
  const joinedSlugs = memberships.map(m => m.app.slug)

  if (joinedSlugs.length === 0) return null

  const updates = await prisma.appUpdate.findMany({
    where:   { appSlug: { in: joinedSlugs } },
    orderBy: { publishedAt: 'desc' },
    take:    8,
  })

  if (updates.length === 0) return null

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-f-text">App updates</h2>
          <span className="text-xs text-f-faint bg-f-raised border border-f-border px-2.5 py-1 rounded-full">
            {joinedSlugs.length} app{joinedSlugs.length !== 1 ? 's' : ''}
          </span>
        </div>
        {/* Coloured dots legend */}
        <div className="hidden sm:flex items-center gap-4">
          {joinedSlugs.map(slug => {
            const t = APP_THEME[slug]
            if (!t) return null
            return (
              <span key={slug} className="flex items-center gap-1.5 text-xs text-f-faint">
                <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                {t.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {updates.map((u) => {
          const app      = APP_THEME[u.appSlug]
          const catStyle = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.Update

          return (
            <div
              key={u.id}
              className="rounded-2xl border border-f-border bg-f-surface hover:border-f-border-bright hover:bg-f-raised/50 transition-all p-5 flex flex-col gap-3"
            >
              {/* Top row: app badge + category + date */}
              <div className="flex items-center gap-2 flex-wrap">
                {app ? (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${app.badge}`}>
                    {app.label}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-f-border text-f-faint bg-f-raised">
                    {u.appSlug.replace('famalii-', '')}
                  </span>
                )}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${catStyle}`}>
                  {u.category}
                </span>
                <span className="ml-auto text-xs text-f-faint tabular-nums">
                  {relativeTime(u.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <p className="text-sm font-bold text-f-text leading-snug">{u.title}</p>

              {/* Body preview */}
              <p className="text-xs text-f-muted leading-relaxed line-clamp-3">{u.body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/** Skeleton shown while AppFeedSection is streaming in */
export function AppFeedSkeleton() {
  return (
    <div className="mt-14 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-28 bg-f-raised rounded" />
        <div className="h-5 w-14 bg-f-raised rounded-full" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-f-border bg-f-surface h-36" />
        ))}
      </div>
    </div>
  )
}
