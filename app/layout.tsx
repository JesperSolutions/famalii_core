import type { Metadata } from 'next'
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { ui } from '@clerk/ui'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Famalii — One identity, every app',
  description: 'Your unified family of financial apps — Invest, Markets, Legal and more.',
}

const clerkAppearance = {
  variables: {
    colorBackground:      '#131318',
    colorInputBackground: '#1a1a22',
    colorInputText:       '#eeeef2',
    colorText:            '#eeeef2',
    colorTextSecondary:   '#8888a2',
    colorPrimary:         '#f97316',
    colorDanger:          '#ef4444',
    borderRadius:         '0.75rem',
    fontFamily:           'var(--font-geist-sans), system-ui, sans-serif',
  },
  elements: {
    card:                      'shadow-2xl',
    socialButtonsBlockButton:  'border-[#363645] bg-[#1a1a22] hover:bg-[#252530] text-[#eeeef2] transition-colors',
    dividerLine:               'bg-[#252530]',
    dividerText:               'text-[#525268]',
    footerActionLink:          'text-[#f97316] hover:text-[#fb923c]',
    formFieldInput:            'border-[#363645] focus:border-[#f97316] transition-colors',
    headerTitle:               'text-[#eeeef2] font-bold',
    headerSubtitle:            'text-[#8888a2]',
    formButtonPrimary:         'bg-[#f97316] hover:bg-[#ea580c] transition-colors',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={clerkAppearance} ui={ui}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased min-h-screen bg-f-bg text-f-text flex flex-col">

          {/* ── Top navigation ─────────────────────────────── */}
          <header className="sticky top-0 z-50 border-b border-f-border bg-f-bg/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

              {/* Logo */}
              <a href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-f-orange flex items-center justify-center shadow-lg group-hover:bg-f-orange-dark transition-colors">
                  <span className="text-white font-black text-sm leading-none">F</span>
                </div>
                <span className="text-[15px] font-bold text-f-text tracking-tight">
                  Famalii
                </span>
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
                        variables: { colorPrimary: '#f97316' },
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
                    <button className="ml-1 text-sm text-white bg-f-orange hover:bg-f-orange-dark transition-colors px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-orange-500/20">
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
                <div className="w-5 h-5 rounded-md bg-f-orange flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">F</span>
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
