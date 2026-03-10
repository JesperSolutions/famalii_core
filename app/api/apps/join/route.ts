import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { joinAppForUser } from '@/lib/auth/joinAppForUser'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const appSlug = typeof body?.appSlug === 'string' ? body.appSlug.trim() : ''

  if (!appSlug) {
    return NextResponse.json({ error: 'appSlug is required' }, { status: 400 })
  }

  // Reject oversized or structurally invalid slugs before touching the DB
  if (appSlug.length > 100 || !/^[a-z0-9-]+$/.test(appSlug)) {
    return NextResponse.json({ error: 'Invalid appSlug format' }, { status: 400 })
  }

  try {
    const membership = await joinAppForUser(userId, appSlug)
    return NextResponse.json({ membership }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to join app'
    // Distinguish "not found" (client error) from unexpected server errors
    const status = message.toLowerCase().includes('not found') ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
