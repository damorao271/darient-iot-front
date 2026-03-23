import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePlaceSpaces } from '../hooks/usePlaceSpaces'
import { useCreateSpace } from '../hooks/useCreateSpace'
import type { CreateSpaceFormValues } from '../schemas/space.schema'
import { SpaceCard } from '../components/SpaceCard'
import { AppSidebar } from '../components/AppSidebar'
import { CreateSpaceModal } from '../components/CreateSpaceModal'

export function PlaceSpaces() {
  const { placeId } = useParams<{ placeId: string }>()
  const { data, isLoading, error } = usePlaceSpaces(placeId)
  const createSpace = useCreateSpace(placeId ?? '')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const place = data?.place
  const spaces = data?.spaces ?? []

  function handleCreateSpace(values: CreateSpaceFormValues) {
    createSpace.mutate(values, {
      onSuccess: () => setIsCreateModalOpen(false),
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-700 font-medium text-sm">
              Directory
            </Link>
            <a href="#" className="text-slate-500 text-sm hover:text-slate-700">
              Bookings
            </a>
            <a href="#" className="text-slate-500 text-sm hover:text-slate-700">
              Dashboard
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search spaces..."
                className="w-48 pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-700">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-violet-200" />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb & Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Link to="/" className="hover:text-violet-600">
                Places
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">
                {place?.name ?? 'Loading...'}
              </span>
            </nav>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {place ? `${place.name} — Spaces` : 'Loading...'}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-slate-600 text-sm">
                  {spaces.length} {spaces.length === 1 ? 'Space' : 'Spaces'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="py-2 px-4 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  Create Space
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              Failed to load spaces. Please try again.
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden animate-pulse"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-1/4" />
                        <div className="h-6 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                      </div>
                    </div>
                    <div className="h-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  timezone={place?.timezone}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateSpaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSpace}
        isSubmitting={createSpace.isPending}
      />
    </div>
  )
}
