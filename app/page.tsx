import { SignUpButton, SignInButton } from '@clerk/nextjs'
import { prisma } from '@/lib/db'

// ── Data ─────────────────────────────────────────────────────────────────────

const APPS = [
  {
    slug:    'famalii-invest',
    initial: 'I',
    name:    'Famalii Invest',
    tagline: 'Portfolio & markets',
    description: 'Track your investment portfolio across stocks, ETFs, and crypto. Live prices, allocation breakdowns, and a personal watchlist — all in one place.',
    accent:  'from-emerald-500/20 to-emerald-500/5',
    border:  'hover:border-emerald-500/40',
    text:    'text-emerald-400',
    dot:     'bg-emerald-400',
    url:     'https://famaliiinvest.vercel.app',
    live:    true,
  },
  {
    slug:    'famalii-legal',
    initial: 'L',
    name:    'Famalii Legal',
    tagline: 'Documents & contracts',
    description: 'Secure document vault, contract templates, and legal tools for your family. GDPR-compliant, 256-bit encrypted, and available whenever you need it.',
    accent:  'from-violet-500/20 to-violet-500/5',
    border:  'hover:border-violet-500/40',
    text:    'text-violet-400',
    dot:     'bg-violet-400',
    url:     'https://famalii-legal.vercel.app',
    live:    true,
  },
  {
    slug:    'famalii-markets',
    initial: 'M',
    name:    'Famalii Markets',
    tagline: 'Market intelligence',
    description: 'Real-time market data, watchlists, sector heat-maps, and AI-powered financial news — built for serious investors in the Famalii ecosystem.',
    accent:  'from-sky-500/20 to-sky-500/5',
    border:  'hover:border-sky-500/40',
    text:    'text-sky-400',
    dot:     'bg-sky-400',
    url:     '#',
    live:    false,
  },
  {
    slug:    'famalii-core',
    initial: 'C',
    name:    'Famalii Core',
    tagline: 'Identity & access',
    description: 'The central hub for your Famalii workspace. Single sign-on across every app, role-based access control, and an audit log of everything that matters.',
    accent:  'from-f-orange/20 to-f-orange/5',
    border:  'hover:border-f-orange/40',
    text:    'text-f-orange',
    dot:     'bg-f-orange',
    url:     '/dashboard',
    live:    true,
  },
]

const STATS = [
  { value: '4',      label: 'Apps in the suite'   },
  { value: '256-bit', label: 'Encryption standard' },
  { value: 'SSO',    label: 'One login, every app' },
  { value: 'GDPR',   label: 'Compliant by design'  },
]

const TRUST = [
  { icon: '🔒', label: 'AES-256 encryption at rest' },
  { icon: '🌐', label: 'GDPR compliant'              },
  { icon: '🔑', label: 'Single Sign-On (SSO)'        },
  { icon: '📋', label: 'Full audit trail'            },
  { icon: '☁️', label: 'Hosted on Vercel Edge'       },
  { icon: '🛡️', label: 'Role-based access control'  },
]

const APP_THEME: Record<string, { badge: string; label: string }> = {
  'famalii-invest': { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Invest' },
  'famalii-legal':  { badge: 'bg-violet-500/10  text-violet-400  border-violet-500/20',  label: 'Legal'  },
}

const CATEGORY_STYLE: Record<string, string> = {
  Feature:  'bg-sky-500/10    text-sky-400    border-sky-500/20',
  Fix:      'bg-amber-500/10  text-amber-400  border-amber-500/20',
  Security: 'bg-red-500/10    text-red-400    border-red-500/20',
  Legal:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Update:   'bg-f-raised      text-f-faint    border-f-border',
}

function relativeTime(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)
  if (days < 1)  return 'Today'
  if (days < 7)  return `${days}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const latestUpdates = await prisma.appUpdate.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 6,
  })

  return (
    <>
      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden dot-grid">
        {/* Multi-layer glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(249,115,22,0.18) 0%, transparent 65%)' }} />
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)' }} />
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Eyebrow badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full border border-f-orange/30 bg-f-orange/8 px-5 py-2 text-sm text-f-muted mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/60 animate-pulse" />
            Now live — Invest &amp; Legal
            <span className="h-3 w-px bg-f-border" />
            <span className="text-f-faint text-xs">Markets coming soon</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 text-5xl sm:text-6xl lg:text-[5rem] font-black tracking-tight leading-[1.03] mb-6">
            One identity.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #f97316 0%, #fb923c 45%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Every Famalii app.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-f-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            A unified platform of specialised financial and legal tools — all secured
            behind a single Famalii account with SSO, role-based access, and a full audit trail.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignUpButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-f-orange hover:bg-f-orange-dark text-white font-bold px-9 py-4 rounded-xl text-base transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                Get started free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-f-border-bright hover:border-f-orange/40 bg-transparent hover:bg-f-orange/5 text-f-text font-medium px-9 py-4 rounded-xl text-base transition-all">
                Sign in
              </button>
            </SignInButton>
          </div>

          {/* App previews row */}
          <div className="mt-16 flex items-center justify-center gap-3 flex-wrap">
            {APPS.filter(a => a.live).map(app => (
              <div key={app.slug} className={`flex items-center gap-2 rounded-xl border border-f-border bg-f-surface px-4 py-2.5`}>
                <div className={`w-1.5 h-1.5 rounded-full ${app.dot}`} />
                <span className={`text-sm font-semibold ${app.text}`}>{app.name.replace('Famalii ', '')}</span>
                <span className="text-xs text-f-faint">Live</span>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-f-border bg-f-surface px-4 py-2.5 opacity-50">
              <div className="w-1.5 h-1.5 rounded-full bg-f-faint" />
              <span className="text-sm font-semibold text-f-faint">Markets</span>
              <span className="text-xs text-f-faint">Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━ STATS BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="border-y border-f-border bg-f-surface/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-px">
          {STATS.map(s => (
            <div key={s.label} className="text-center px-4 py-3">
              <p className="text-2xl font-black text-f-orange tabular-nums">{s.value}</p>
              <p className="text-xs text-f-faint mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ━━ APPS GRID ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-3">The ecosystem</p>
          <h2 className="text-3xl sm:text-4xl font-black text-f-text mb-4">
            Four apps. One platform.
          </h2>
          <p className="text-f-muted max-w-xl mx-auto text-lg">
            Each app is purpose-built, but they all share your identity, your data security, and your workspace.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {APPS.map((app) => (
            <div
              key={app.slug}
              className={`card-hover group relative rounded-3xl border border-f-border bg-gradient-to-br ${app.accent} ${app.border} overflow-hidden p-7 flex flex-col gap-5 transition-all`}
            >
              {/* Coming soon */}
              {!app.live && (
                <div className="absolute top-5 right-5 text-xs text-f-faint bg-f-raised border border-f-border px-2.5 py-1 rounded-full">
                  Coming soon
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-f-elevated border border-f-border-bright flex items-center justify-center text-2xl font-black ${app.text} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {app.initial}
                </div>
                <div>
                  <p className="text-lg font-black text-f-text">{app.name}</p>
                  <p className={`text-sm font-semibold ${app.text}`}>{app.tagline}</p>
                </div>
              </div>

              <p className="text-sm text-f-muted leading-relaxed">{app.description}</p>

              {app.live ? (
                <a
                  href={app.url}
                  className={`mt-auto self-start inline-flex items-center gap-1.5 text-sm font-bold ${app.text} hover:opacity-80 transition-opacity`}
                >
                  Open {app.name.replace('Famalii ', '')}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 4h8v8M4 12L12 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <p className={`mt-auto self-start text-sm font-bold ${app.text} opacity-40`}>
                  In development
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ━━ LIVE UPDATES FEED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {latestUpdates.length > 0 && (
        <section className="border-t border-f-border bg-f-surface">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-3">What's new</p>
                <h2 className="text-3xl sm:text-4xl font-black text-f-text">
                  Latest from the Famalii collective
                </h2>
                <p className="text-f-muted mt-2 max-w-lg">
                  We ship fast. Here's what's landed across every Famalii app recently.
                </p>
              </div>
              <SignUpButton>
                <button className="flex-shrink-0 inline-flex items-center gap-2 border border-f-orange/40 bg-f-orange/8 hover:bg-f-orange/15 text-f-orange text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                  Get notified
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </SignUpButton>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestUpdates.map(u => {
                const app = APP_THEME[u.appSlug]
                const cat = CATEGORY_STYLE[u.category] ?? CATEGORY_STYLE.Update
                return (
                  <div
                    key={u.id}
                    className="rounded-2xl border border-f-border bg-f-raised hover:border-f-border-bright hover:bg-f-elevated transition-all p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {app ? (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${app.badge}`}>{app.label}</span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-f-border text-f-faint bg-f-surface">
                          {u.appSlug.replace('famalii-', '')}
                        </span>
                      )}
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cat}`}>{u.category}</span>
                      <span className="ml-auto text-xs text-f-faint tabular-nums">{relativeTime(u.publishedAt)}</span>
                    </div>
                    <p className="text-sm font-bold text-f-text leading-snug">{u.title}</p>
                    <p className="text-xs text-f-muted leading-relaxed line-clamp-3 flex-1">{u.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ━━ HOW IT WORKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-3">Simple by design</p>
          <h2 className="text-3xl sm:text-4xl font-black text-f-text">Up and running in 3 steps</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Create one account',
              body: 'Sign up once with your email. No separate accounts per app — your Famalii identity carries everywhere.',
              color: 'text-f-orange',
            },
            {
              step: '02',
              title: 'Add the apps you need',
              body: 'Browse your workspace catalogue and subscribe to Invest, Legal, or any upcoming app with a single click.',
              color: 'text-emerald-400',
            },
            {
              step: '03',
              title: 'Launch instantly',
              body: 'Authenticated automatically in every app you\'ve joined. Your roles, permissions, and data are already there.',
              color: 'text-violet-400',
            },
          ].map(({ step, title, body, color }) => (
            <div key={step} className="relative rounded-3xl border border-f-border bg-f-surface p-8">
              <p className={`text-6xl font-black font-mono ${color} opacity-20 mb-5 leading-none`}>{step}</p>
              <h3 className="font-black text-f-text text-lg mb-3">{title}</h3>
              <p className="text-sm text-f-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━ TRUST BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="border-y border-f-border bg-f-surface">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-xs uppercase tracking-widest text-f-faint font-semibold mb-6">Built with security first</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {TRUST.map(t => (
              <div key={t.label} className="flex items-center gap-2 text-sm text-f-muted">
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ━━ BOTTOM CTA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-widest text-f-orange font-semibold mb-4">Join the platform</p>
          <h2 className="text-4xl sm:text-5xl font-black text-f-text mb-5 leading-tight">
            Your entire financial life,<br />in one place.
          </h2>
          <p className="text-f-muted text-lg mb-10 max-w-lg mx-auto">
            One account. Every Famalii app. Free to start — scales with you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignUpButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-f-orange hover:bg-f-orange-dark text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5">
                Create your account
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center border border-f-border-bright hover:border-f-orange/30 text-f-muted hover:text-f-text font-medium px-10 py-4 rounded-xl text-base transition-all">
                Already a member? Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </section>
    </>
  )
}

