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

  const joinedCount  = apps.filter(a => a.joined).length
  const totalCount   = apps.length
  const displayName  = user?.firstName ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-2">
          Your workspace
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-f-text mb-2 tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-f-muted">
          {joinedCount === 0
            ? 'You haven\'t joined any apps yet — browse the catalogue below to get started.'
            : `You have access to ${joinedCount} of ${totalCount} Famalii apps.`}
        </p>
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Apps joined',     value: joinedCount,           accent: true },
          { label: 'Apps available',  value: totalCount },
          { label: 'Account status',  value: 'Active', isText: true },
        ].map(({ label, value, accent, isText }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${
              accent
                ? 'border-f-orange/30 bg-f-orange/5'
                : 'border-f-border bg-f-surface'
            }`}
          >
            <p className="text-xs text-f-muted mb-1">{label}</p>
            <p className={`text-2xl font-black ${accent ? 'text-f-orange' : isText ? 'text-emerald-400' : 'text-f-text'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── App grid ──────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-f-text">Your apps</h2>
        <a
          href="/apps"
          className="text-sm text-f-orange hover:text-f-orange-light transition-colors flex items-center gap-1"
        >
          Browse all
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <AppSwitcher apps={apps} />
    </div>
  )
}
