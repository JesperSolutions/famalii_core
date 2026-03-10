import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/db'

// Svix signs every Clerk webhook. Verify the signature before processing.
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

type ClerkUserPayload = {
  id: string
  email_addresses: Array<{ email_address: string; id: string }>
  primary_email_address_id: string
  first_name: string | null
  last_name: string | null
  image_url: string
}

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set')
    return new NextResponse('Webhook secret not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing svix headers', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let event: { type: string; data: ClerkUserPayload }
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof event
  } catch {
    return new NextResponse('Invalid webhook signature', { status: 400 })
  }

  const { type, data } = event

  // Resolve the primary email address
  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id,
  )?.email_address

  if (type === 'user.created') {
    if (!primaryEmail) {
      return new NextResponse('No primary email on user', { status: 422 })
    }

    await prisma.user.create({
      data: {
        id: data.id,
        email: primaryEmail,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      },
    })

    await prisma.auditLog.create({
      data: { userId: data.id, action: 'user.created' },
    })
  }

  if (type === 'user.updated') {
    if (!primaryEmail) {
      return new NextResponse('No primary email on user', { status: 422 })
    }

    await prisma.user.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        email: primaryEmail,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      },
      update: {
        email: primaryEmail,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
      },
    })
  }

  if (type === 'user.deleted') {
    // Cascade delete via Prisma (memberships and audit entries handled by schema)
    await prisma.user.deleteMany({ where: { id: data.id } })

    await prisma.auditLog.create({
      data: { userId: data.id, action: 'user.deleted' },
    })
  }

  return NextResponse.json({ received: true })
}
