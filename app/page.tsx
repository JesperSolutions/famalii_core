import { SignUpButton, SignInButton } from '@clerk/nextjs'

const APPS = [
  {
    initial: 'I',
    name: 'Famalii Invest',
    tagline: 'Portfolio management',
    description: 'Track investments, analyse returns, and manage your portfolio across asset classes.',
  },
  {
    initial: 'M',
    name: 'Famalii Markets',
    tagline: 'Market intelligence',
    description: 'Real-time data, watchlists, and analytics to keep you ahead of the market.',
  },
  {
    initial: 'L',
    name: 'Famalii Legal',
    tagline: 'Legal workspace',
    description: 'Document storage, contract management, and legal tools in one secure place.',
  },
  {
    initial: 'C',
    name: 'Famalii Core',
    tagline: 'Identity & access',
    description: 'Your central account and access hub — one login for every Famalii service.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden dot-grid">
        {/* Radial spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,115,22,0.14) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-f-border bg-f-surface px-4 py-1.5 text-xs text-f-muted mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-f-orange animate-pulse" />
            One platform — four powerful apps
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            One identity.{' '}
            <br className="hidden sm:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Every Famalii app.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-f-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Sign in once and instantly access Invest, Markets, Legal, and more —
            all from a single secure Famalii account.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignUpButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-f-orange hover:bg-f-orange-dark text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5">
                Create your account
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-f-border hover:border-f-border-bright bg-transparent hover:bg-f-raised text-f-text font-medium px-8 py-3.5 rounded-xl text-base transition-all">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-f-border to-transparent" />
      </div>

      {/* ── APPS GRID ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-f-text mb-3">
            Everything in the Famalii suite
          </h2>
          <p className="text-f-muted max-w-lg mx-auto">
            Four specialised apps. One unified account. Zero friction.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPS.map((app, i) => (
            <div
              key={app.initial}
              className="card-hover group rounded-2xl border border-f-border bg-f-surface p-6 flex flex-col gap-4"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-f-raised border border-f-border flex items-center justify-center text-xl font-black text-f-orange group-hover:bg-f-orange group-hover:text-white group-hover:border-f-orange transition-all duration-200">
                {app.initial}
              </div>

              <div>
                <p className="font-bold text-f-text text-sm mb-0.5">{app.name}</p>
                <p className="text-xs text-f-orange mb-2 font-medium">{app.tagline}</p>
                <p className="text-xs text-f-muted leading-relaxed">{app.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="border-t border-f-border bg-f-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-f-text mb-3">
              Simple by design
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Create one account', body: 'Sign up once with your email. No separate logins per app.' },
              { step: '02', title: 'Join the apps you need', body: 'Browse the catalogue and add Invest, Markets, or Legal to your workspace.' },
              { step: '03', title: 'Launch instantly', body: 'Your Famalii account carries your identity and access to every app you've joined.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-2xl border border-f-border bg-f-raised p-8">
                <p className="text-4xl font-black text-f-orange/20 mb-4 font-mono">{step}</p>
                <h3 className="font-bold text-f-text mb-2">{title}</h3>
                <p className="text-sm text-f-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-f-text mb-4">
          Ready to get started?
        </h2>
        <p className="text-f-muted mb-8 max-w-md mx-auto">
          Join Famalii and access your full suite of financial tools today — for free.
        </p>
        <SignUpButton>
          <button className="inline-flex items-center gap-2 bg-f-orange hover:bg-f-orange-dark text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-xl hover:shadow-orange-500/25 hover:-translate-y-0.5">
            Start for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </SignUpButton>
      </section>
    </>
  )
}
