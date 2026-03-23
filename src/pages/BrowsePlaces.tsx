import { useState } from 'react'
import { usePlaces } from '../hooks/usePlaces'
import { ApiErrorAlert } from '../components/ApiErrorAlert'
import { PlaceCard } from '../components/PlaceCard'
import { RegisterPlaceCard } from '../components/RegisterPlaceCard'
import { AppSidebar } from '../components/AppSidebar'

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
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-700 font-medium text-sm">Directory</a>
            <a href="#" className="text-slate-500 text-sm hover:text-slate-700">Bookings</a>
            <a href="#" className="text-slate-500 text-sm hover:text-slate-700">Dashboard</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Quick find..."
                className="w-48 pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-violet-200" />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb & Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Workspace Directory
            </p>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Browse Places</h2>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm">{total} Active Locations</span>
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-sky-50 rounded-lg border border-sky-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location</label>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700">
                <option>All Global Hubs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Capacity</label>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700">
                <option>Any Capacity</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Property Type</label>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700">
                <option>All Types</option>
              </select>
            </div>
            <button className="ml-auto px-4 py-2 rounded-lg bg-sky-100 text-sky-800 text-sm font-medium hover:bg-sky-200 transition-colors">
              Advanced Filters
            </button>
          </div>

          {/* Grid */}
          {error && <ApiErrorAlert error={error} onRetry={refetch} />}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse">
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
              <RegisterPlaceCard />
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
