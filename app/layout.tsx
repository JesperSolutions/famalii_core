import type { Metadata } from 'next'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Famalii',
  description: 'Your unified family of financial apps',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
            <a href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
              Famalii
            </a>
            <nav className="flex items-center gap-4">
              <Show when="signed-in">
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </a>
                <a href="/apps" className="text-sm text-gray-600 hover:text-gray-900">
                  Apps
                </a>
                <UserButton />
              </Show>
              <Show when="signed-out">
                <SignInButton>
                  <button className="text-sm text-gray-700 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-md">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md font-medium">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
            </nav>
          </header>
          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  )
}
