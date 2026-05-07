import type { Metadata } from 'next'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { ui } from '@clerk/ui'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import { FamaliiLogo } from '@/components/FamaliiLogo'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Famalii — One identity, every app',
  description: 'Your unified family of financial apps — Invest, Markets, Legal and more.',
}

const clerkAppearance = {
  variables: {
    colorBackground:      '#11141f',
    colorInputBackground: '#181b29',
    colorInputText:       '#eeeef2',
    colorText:            '#eeeef2',
    colorTextSecondary:   '#8a93ab',
    colorPrimary:         '#9EEAAF',
    colorDanger:          '#ef4444',
    borderRadius:         '0.75rem',
    fontFamily:           'var(--font-dm-sans), "DM Sans", system-ui, sans-serif',
  },
  elements: {
    card:                      'shadow-2xl',
    socialButtonsBlockButton:  'border-[#363c52] bg-[#181b29] hover:bg-[#252a3a] text-[#eeeef2] transition-colors',
    dividerLine:               'bg-[#252a3a]',
    dividerText:               'text-[#525a73]',
    footerActionLink:          'text-[#9EEAAF] hover:text-[#c5f3d0]',
    formFieldInput:            'border-[#363c52] focus:border-[#9EEAAF] transition-colors',
    headerTitle:               'text-[#eeeef2] font-bold',
    headerSubtitle:            'text-[#8a93ab]',
    formButtonPrimary:         'bg-[#9EEAAF] hover:bg-[#7cd896] text-[#192E5B] font-semibold transition-colors',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={clerkAppearance} ui={ui}>
      <html lang="en" className={`${dmSans.variable} ${geistMono.variable}`}>
        <body className="antialiased min-h-screen bg-f-bg text-f-text flex flex-col">

          {/* ── Top navigation ─────────────────────────────── */}
          <header className="sticky top-0 z-50 border-b border-f-border bg-f-bg/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

              {/* Logo */}
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-f-blue flex items-center justify-center shadow-lg ring-1 ring-f-border group-hover:ring-f-orange/40 transition-all">
                  <FamaliiLogo variant="symbol" tone="light" className="w-4 h-4" />
                </div>
                <FamaliiLogo variant="full" tone="light" className="text-[15px] text-f-text" />
              </a>

              {/* Nav links + auth */}
              <nav className="flex items-center gap-1">
                <Show when="signed-in">
                  <a
                    href="/dashboard"
                    className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/apps"
                    className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised"
                  >
                    Apps
                  </a>
                  <a
                    href="/settings"
                    className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised"
                  >
                    Settings
                  </a>
                  <div className="ml-2">
                    <UserButton
                      userProfileUrl="/settings"
                      appearance={{
                        variables: { colorPrimary: '#9EEAAF' },
                        elements: { avatarBox: 'ring-2 ring-f-border hover:ring-f-orange transition-all' },
                      }}
                    />
                  </div>
              </Show>

                <Show when="signed-out">
                  <SignInButton>
                    <button className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg border border-f-border hover:border-f-border-bright">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="ml-1 text-sm text-f-blue bg-f-orange hover:bg-f-orange-dark transition-colors px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/20">
                      Get started
                    </button>
                  </SignUpButton>
                </Show>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/* ── Footer ─────────────────────────────────────── */}
          <footer className="border-t border-f-border mt-24 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-f-faint">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-f-blue flex items-center justify-center">
                  <FamaliiLogo variant="symbol" tone="light" className="w-2.5 h-2.5" />
                </div>
                <span>Famalii © {new Date().getFullYear()}</span>
              </div>
              <span>One identity. Every app.</span>
            </div>
          </footer>

        </body>
      </html>
    </ClerkProvider>
  )
}
