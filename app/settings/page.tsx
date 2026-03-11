import { UserProfile } from '@clerk/nextjs'
import { requireAuth } from '@/lib/auth/requireAuth'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings — Famalii' }

export default async function SettingsPage() {
  await requireAuth()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-2">Account</p>
      <h1 className="text-3xl font-black text-f-text mb-10">Settings</h1>
      <UserProfile
        appearance={{
          variables: { colorPrimary: '#f97316' },
          elements: {
            rootBox: 'w-full',
            card: 'shadow-none rounded-2xl',
          },
        }}
      />
    </div>
  )
}
