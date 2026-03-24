import { useState } from 'react'
import { usePlaces } from '../hooks/usePlaces'
import { ApiErrorAlert } from '../components/ApiErrorAlert'
import { PlaceCard } from '../components/PlaceCard'
import { AppSidebar } from '../components/AppSidebar'
import { AppHeader } from '../components/AppHeader'

export function BrowsePlaces() {
  const [page, setPage] = useState(1)
  const limit = 12
  const { data, isLoading, error, refetch } = usePlaces(page, limit)

  const places = data?.places ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / limit) || 1
  const start = total > 0 ? (page - 1) * limit + 1 : 0
  const end = Math.min(page * limit, total)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <AppHeader searchPlaceholder="Quick find..." />

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb & Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Places</h2>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm">
                  {total} Active Locations
                </span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {error && <ApiErrorAlert error={error} onRetry={refetch} />}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-9 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 0 && !isLoading && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                Showing {start} to {end} of {total} places
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = page <= 3 ? i + 1 : page - 2 + i
                  if (p > totalPages) return null
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        p === page
                          ? 'bg-violet-600 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
