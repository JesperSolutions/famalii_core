import { getAppSwitcherData } from '@/lib/appSwitcher'
import { AppSwitcher } from '@/components/AppSwitcher'

/**
 * Async server component that owns the apps data fetch.
 * Wrapped in <Suspense> by the dashboard page so the header renders immediately
 * while this section streams in.
 */
export async function AppsSection({ userId }: { userId: string }) {
  const apps = await getAppSwitcherData(userId)
  const joinedCount = apps.filter(a => a.joined).length
  const totalCount  = apps.length

  return (
    <>
      {/* Dynamic subtitle */}
      <p className="text-f-muted mb-10">
        {joinedCount === 0
          ? "You haven't joined any apps yet — browse the catalogue below to get started."
          : `You have access to ${joinedCount} of ${totalCount} Famalii apps.`}
      </p>

      {/* Quick launch strip */}
      {joinedCount > 0 && (
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-f-faint font-semibold mb-3">Quick launch</p>
          <div className="flex flex-wrap gap-3">
            {apps.filter(a => a.joined).map((app) => (
              <a
                key={app.slug}
                href={app.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-f-orange/30 bg-f-orange/5 hover:bg-f-orange/10 hover:border-f-orange/50 px-4 py-2.5 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-f-orange flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {app.iconPlaceholder}
                </div>
                <span className="text-sm font-semibold text-f-text">{app.name}</span>
                <svg className="text-f-faint group-hover:text-f-orange transition-colors" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4h8v8M4 12L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Apps joined',    value: joinedCount, accent: true },
          { label: 'Apps available', value: totalCount },
          { label: 'Account status', value: 'Active', isText: true },
        ].map(({ label, value, accent, isText }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${
              accent ? 'border-f-orange/30 bg-f-orange/5' : 'border-f-border bg-f-surface'
            }`}
          >
            <p className="text-xs text-f-muted mb-1">{label}</p>
            <p className={`text-2xl font-black ${accent ? 'text-f-orange' : isText ? 'text-emerald-400' : 'text-f-text'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* App grid */}
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
    </>
  )
}

/** Skeleton shown while AppsSection is loading */
export function AppsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-72 bg-f-raised rounded mb-10" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-f-border bg-f-surface h-[76px]" />
        ))}
      </div>
      <div className="h-6 w-24 bg-f-raised rounded mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-f-border bg-f-surface h-48" />
        ))}
      </div>
    </div>
  )
}
