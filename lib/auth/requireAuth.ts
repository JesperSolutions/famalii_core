import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

/**
 * Asserts that the caller is authenticated.
 * Redirects to /sign-in if not. Safe to call in Server Components and Server Actions.
 * Returns the Clerk userId on success.
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return userId
}
