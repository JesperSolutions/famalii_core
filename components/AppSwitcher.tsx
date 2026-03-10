'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AppSwitcherItem } from '@/lib/appSwitcher'

interface Props {
  apps: AppSwitcherItem[]
}

export function AppSwitcher({ apps }: Props) {
  const router = useRouter()
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null)

  async function handleJoin(slug: string) {
    setJoiningSlug(slug)
    try {
      const res = await fetch('/api/apps/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSlug: slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? 'Failed to join app')
        return
      }
      router.refresh()
    } finally {
      setJoiningSlug(null)
    }
  }

  if (apps.length === 0) {
    return (
      <div className="rounded-2xl border border-f-border bg-f-surface p-10 text-center">
        <p className="text-f-muted text-sm">No apps are available right now.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <div
          key={app.slug}
          className={`card-hover group relative rounded-2xl border p-5 flex flex-col gap-4 transition-all ${
            app.joined
              ? 'border-f-orange/40 bg-f-surface glow-orange'
              : 'border-f-border bg-f-surface hover:border-f-border-bright'
          }`}
        >
          {/* Joined indicator */}
          {app.joined && (
            <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-f-orange shadow-lg shadow-orange-500/50" />
          )}

          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0 transition-all ${
                app.joined
                  ? 'bg-f-orange text-white shadow-md shadow-orange-500/20'
                  : 'bg-f-raised text-f-muted border border-f-border group-hover:text-f-text group-hover:border-f-border-bright'
              }`}
            >
              {app.iconPlaceholder}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-f-text text-sm truncate">{app.name}</p>
              {app.joined && app.role ? (
                <p className="text-xs text-f-orange font-medium capitalize">
                  {app.role.toLowerCase()}
                </p>
              ) : (
                <p className="text-xs text-f-faint">Not joined</p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-f-muted leading-relaxed flex-1 line-clamp-3">
            {app.description}
          </p>

          {/* Action */}
          {app.joined ? (
            <a
              href={`/apps/${app.slug}`}
              className="mt-auto inline-flex items-center justify-center gap-1.5 bg-f-orange hover:bg-f-orange-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-orange-500/25"
            >
              Open app
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <button
              onClick={() => handleJoin(app.slug)}
              disabled={joiningSlug === app.slug}
              className="mt-auto inline-flex items-center justify-center gap-1.5 border border-f-border-bright hover:border-f-orange text-f-muted hover:text-f-orange text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {joiningSlug === app.slug ? (
                <>
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Joining…
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Add to Famalii
                </>
              )}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
