import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { leaveAppForUser } from '@/lib/auth/leaveAppForUser'

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

  if (appSlug.length > 100 || !/^[a-z0-9-]+$/.test(appSlug)) {
    return NextResponse.json({ error: 'Invalid appSlug format' }, { status: 400 })
  }

  try {
    await leaveAppForUser(userId, appSlug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to leave app'
    const status = message.toLowerCase().includes('not found') ? 404
      : message.toLowerCase().includes('cannot remove') ? 403
      : 500
    return NextResponse.json({ error: message }, { status })
  }
}
