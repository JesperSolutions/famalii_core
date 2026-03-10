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
      // Refresh server component data without a full page reload
      router.refresh()
    } finally {
      setJoiningSlug(null)
    }
  }

  if (apps.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No apps are available right now.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <div
          key={app.slug}
          className={`rounded-xl border p-5 flex flex-col gap-3 transition-shadow ${
            app.joined
              ? 'border-indigo-200 bg-white shadow-sm hover:shadow-md'
              : 'border-gray-200 bg-gray-50 opacity-70'
          }`}
        >
          {/* Icon + name */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                app.joined
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {app.iconPlaceholder}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
              {app.joined && app.role && (
                <p className="text-xs text-gray-400 capitalize">
                  {app.role.toLowerCase()}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed flex-1">
            {app.description}
          </p>

          {/* Action */}
          {app.joined ? (
            <a
              href={`/apps/${app.slug}`}
              className="mt-auto inline-flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-lg"
            >
              Open app ↗
            </a>
          ) : (
            <button
              onClick={() => handleJoin(app.slug)}
              disabled={joiningSlug === app.slug}
              className="mt-auto inline-flex items-center justify-center gap-1 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-xs font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joiningSlug === app.slug ? 'Joining…' : 'Add to my Famalii'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
