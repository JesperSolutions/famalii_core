'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { AppSwitcherItem } from '@/lib/appSwitcher'

interface Props {
  apps: AppSwitcherItem[]
}

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

let toastId = 0

export function AppSwitcher({ apps: initialApps }: Props) {
  const router = useRouter()
  // Optimistic local copy — avoids full page reload flash on join
  const [apps, setApps] = useState(initialApps)
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null)
  const [leavingSlug, setLeavingSlug] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Keep in sync when server re-renders (e.g. after router.refresh())
  useEffect(() => { setApps(initialApps) }, [initialApps])

  function addToast(message: string, type: Toast['type']) {
    const id = ++toastId
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }

  async function handleJoin(slug: string) {
    setJoiningSlug(slug)
    // Optimistically flip the card to joined state immediately
    setApps((prev) =>
      prev.map((a) => a.slug === slug ? { ...a, joined: true, role: 'MEMBER' as const } : a)
    )
    try {
      const res = await fetch('/api/apps/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSlug: slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        // Roll back optimistic update
        setApps(initialApps)
        addToast(data.error ?? 'Failed to join app', 'error')
        return
      }
      const appName = apps.find((a) => a.slug === slug)?.name ?? 'App'
      addToast(`You joined ${appName}!`, 'success')
      router.refresh()
    } catch {
      setApps(initialApps)
      addToast('Network error — please try again', 'error')
    } finally {
      setJoiningSlug(null)
    }
  }

  async function handleLeave(slug: string) {
    setLeavingSlug(slug)
    // Optimistically flip back to not-joined
    setApps((prev) =>
      prev.map((a) => a.slug === slug ? { ...a, joined: false, role: null } : a)
    )
    try {
      const res = await fetch('/api/apps/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appSlug: slug }),
      })
      if (!res.ok) {
        const data = await res.json()
        setApps(initialApps)
        addToast(data.error ?? 'Failed to remove app', 'error')
        return
      }
      const appName = apps.find((a) => a.slug === slug)?.name ?? 'App'
      addToast(`${appName} removed from your workspace`, 'success')
      router.refresh()
    } catch {
      setApps(initialApps)
      addToast('Network error — please try again', 'error')
    } finally {
      setLeavingSlug(null)
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
    <>
      {/* ── Toast stack ───────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl animate-fade-up backdrop-blur-sm ${
              t.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            {t.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── App grid ──────────────────────────────────────── */}
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
            {/* Joined indicator + remove button */}
            {app.joined && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-f-orange shadow-lg shadow-orange-500/50" />
                <button
                  onClick={() => handleLeave(app.slug)}
                  disabled={leavingSlug === app.slug}
                  title={`Remove ${app.name} from your workspace`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-md flex items-center justify-center text-f-faint hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30"
                >
                  {leavingSlug === app.slug ? (
                    <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
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
                href={app.launchUrl}
                target="_blank"
                rel="noopener noreferrer"
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
    </>
  )
}
