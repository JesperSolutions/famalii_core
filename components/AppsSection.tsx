import { getAppSwitcherData } from '@/lib/appSwitcher'
import { AppSwitcher } from '@/components/AppSwitcher'

export async function AppsSection({ userId }: { userId: string }) {
  const apps = await getAppSwitcherData(userId)
  const joinedCount = apps.filter(a => a.joined).length
  const totalCount  = apps.length
  const joinedApps  = apps.filter(a => a.joined)

  return (
    <>
      {/* ── Stats row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">

        {/* Accent — apps joined */}
        <div className="relative overflow-hidden rounded-2xl border border-f-orange/25 bg-f-surface p-5">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-f-orange/15 blur-2xl pointer-events-none" />
          <p className="text-xs text-f-muted font-medium mb-2">Apps joined</p>
          <p className="text-3xl font-black text-f-orange tabular-nums">{joinedCount}</p>
          <p className="text-xs text-f-faint mt-1">of {totalCount} available</p>
        </div>

        {/* Account status */}
        <div className="rounded-2xl border border-f-border bg-f-surface p-5">
          <p className="text-xs text-f-muted font-medium mb-2">Account status</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/50" />
            <p className="text-xl font-black text-emerald-400">Active</p>
          </div>
          <p className="text-xs text-f-faint">All systems operational</p>
        </div>

        {/* Catalogue size */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-f-border bg-f-surface p-5">
          <p className="text-xs text-f-muted font-medium mb-2">Apps available</p>
          <p className="text-3xl font-black text-f-text tabular-nums">{totalCount}</p>
          <p className="text-xs text-f-faint mt-1">Explore the catalogue</p>
        </div>
      </div>

      {/* ── Quick launch ───────────────────────────────────── */}
      {joinedApps.length > 0 ? (
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-f-faint font-semibold mb-3">Quick launch</p>
          <div className="flex flex-wrap gap-2.5">
            {joinedApps.map((app) => (
              <a
                key={app.slug}
                href={app.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-xl border border-f-border bg-f-surface hover:border-f-orange/40 hover:bg-f-orange/5 px-4 py-2.5 transition-all"
              >
                <div className="w-6 h-6 rounded-md bg-f-orange flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm shadow-orange-500/30">
                  {app.iconPlaceholder}
                </div>
                <span className="text-sm font-semibold text-f-muted group-hover:text-f-text transition-colors">{app.name}</span>
                <svg className="text-f-faint group-hover:text-f-orange transition-colors" width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4h8v8M4 12L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-f-muted mb-10">
          You haven't joined any apps yet — browse the catalogue below to get started.
        </p>
      )}

      {/* ── App grid header ────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-f-text">All apps</h2>
          <span className="text-xs text-f-faint bg-f-raised border border-f-border px-2 py-0.5 rounded-full">{totalCount}</span>
        </div>
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
    </>
  )
}

export function AppsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-f-border bg-f-surface h-24" />
        ))}
      </div>
      <div className="flex gap-2.5 mb-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-f-border bg-f-surface h-10 w-32" />
        ))}
      </div>
      <div className="h-6 w-24 bg-f-raised rounded mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-f-border bg-f-surface h-52" />
        ))}
      </div>
    </div>
  )
}
