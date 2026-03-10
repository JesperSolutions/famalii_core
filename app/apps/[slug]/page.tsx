import { requireAppAccess } from '@/lib/auth/requireAppAccess'

interface Props {
  params: Promise<{ slug: string }>
}

const ROLE_LABELS: Record<string, string> = {
  OWNER:  'Owner',
  ADMIN:  'Admin',
  MEMBER: 'Member',
  VIEWER: 'Viewer',
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params
  const membership = await requireAppAccess(slug)
  const { app } = membership
  const role = ROLE_LABELS[membership.role] ?? membership.role.toLowerCase()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <a
        href="/apps"
        className="inline-flex items-center gap-1.5 text-xs text-f-muted hover:text-f-text transition-colors mb-8"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All apps
      </a>

      {/* App hero card */}
      <div className="rounded-2xl border border-f-border bg-f-surface p-8 mb-6">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-f-orange flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-orange-500/20 flex-shrink-0">
            {app.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-f-text mb-1">{app.name}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active member
              </span>
              <span className="inline-flex items-center text-xs font-medium text-f-muted bg-f-raised border border-f-border rounded-full px-3 py-1">
                {role}
              </span>
            </div>
          </div>
        </div>

        <p className="text-f-muted leading-relaxed mb-8">{app.description}</p>

        <a
          href={app.launchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-f-orange hover:bg-f-orange-dark text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
        >
          Open {app.name}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Slug',    value: app.slug },
          { label: 'Role',    value: role },
          { label: 'Status',  value: app.isActive ? 'Active' : 'Inactive' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-f-border bg-f-raised p-4">
            <p className="text-xs text-f-faint mb-1">{label}</p>
            <p className="text-sm font-semibold text-f-text">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
