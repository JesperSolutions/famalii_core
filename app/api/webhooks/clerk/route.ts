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
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
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

    // Atomic: user row + audit log succeed or fail together
    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: data.id,
          email: primaryEmail,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
      }),
      prisma.auditLog.create({
        data: { userId: data.id, action: 'user.created' },
      }),
    ])
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
    // Log before deletion; userId FK cannot reference a deleted user, so store
    // the deleted ID in metadata and delete the user atomically.
    await prisma.$transaction([
      prisma.auditLog.create({
        data: { userId: null, action: 'user.deleted', metadata: { deletedUserId: data.id } },
      }),
      prisma.user.deleteMany({ where: { id: data.id } }),
    ])
  }

  return NextResponse.json({ received: true })
}
