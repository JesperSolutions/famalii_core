export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-4">
        <div className="h-3 w-28 bg-f-raised rounded mb-3" />
        <div className="h-9 w-72 bg-f-raised rounded" />
      </div>
      {/* Subtitle + stats */}
      <div className="h-4 w-80 bg-f-raised rounded mb-10 mt-2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-f-border bg-f-surface h-[76px]" />
        ))}
      </div>
      {/* App grid */}
      <div className="h-6 w-24 bg-f-raised rounded mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-f-border bg-f-surface h-48" />
        ))}
      </div>
    </div>
  )
}
