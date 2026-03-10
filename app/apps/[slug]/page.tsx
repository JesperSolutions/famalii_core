import { requireAppAccess } from '@/lib/auth/requireAppAccess'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params
  // requireAppAccess handles auth + membership check; returns 404 if not a member
  const membership = await requireAppAccess(slug)
  const { app } = membership

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
          {app.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
          <p className="text-sm text-gray-500 capitalize">
            Role: <span className="font-medium text-gray-700">{membership.role.toLowerCase()}</span>
          </p>
        </div>
      </div>

      <p className="text-gray-600 mb-8">{app.description}</p>

      <a
        href={app.launchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm"
      >
        Open {app.name} ↗
      </a>
    </div>
  )
}
