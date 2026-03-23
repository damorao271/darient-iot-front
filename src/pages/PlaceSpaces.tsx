import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePlaceSpaces } from '../hooks/usePlaceSpaces'
import { useCreateSpace } from '../hooks/useCreateSpace'
import { useUpdateSpace } from '../hooks/useUpdateSpace'
import { useDeleteSpace } from '../hooks/useDeleteSpace'
import type { CreateSpaceFormValues } from '../schemas/space.schema'
import type { Space, SpaceSortBy, SortOrder } from '../types/spaces.types'
import {
  SPACE_PAGE_SIZE_OPTIONS,
  SPACE_SORT_BY_OPTIONS,
} from '../constants/spaces'
import { SpaceCard } from '../components/SpaceCard'
import { AppSidebar } from '../components/AppSidebar'
import { AppHeader } from '../components/AppHeader'
import { SpaceFormModal } from '../components/SpaceFormModal'
import { DeleteSpaceConfirmModal } from '../components/DeleteSpaceConfirmModal'

export function PlaceSpaces() {
  const { placeId } = useParams<{ placeId: string }>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<SpaceSortBy>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const { data, isLoading, error } = usePlaceSpaces(placeId, {
    page,
    pageSize,
    sortBy,
    sortOrder,
  })
  const createSpace = useCreateSpace(placeId ?? '')
  const updateSpace = useUpdateSpace(placeId ?? '')
  const deleteSpaceMutation = useDeleteSpace(placeId ?? '', {
    showErrorToast: false,
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [spaceToEdit, setSpaceToEdit] = useState<Space | null>(null)
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null)

  const place = data?.place
  const spaces = data?.spaces ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / pageSize) || 1
  const start = total > 0 ? (page - 1) * pageSize + 1 : 0
  const end = Math.min(page * pageSize, total)

  function handleSpaceFormSubmit(values: CreateSpaceFormValues) {
    if (spaceToEdit) {
      updateSpace.mutate(
        { spaceId: spaceToEdit.id, values },
        { onSuccess: closeSpaceForm },
      )
    } else {
      createSpace.mutate(values, { onSuccess: closeSpaceForm })
    }
  }

  function closeSpaceForm() {
    setIsCreateModalOpen(false)
    setSpaceToEdit(null)
  }

  function handleDeleteSpace(space: Space) {
    setSpaceToDelete(space)
  }

  function confirmDeleteSpace(spaceId: string) {
    deleteSpaceMutation.mutate(spaceId, {
      onSuccess: () => setSpaceToDelete(null),
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <AppHeader searchPlaceholder="Search spaces..." />

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
                  {total} {total === 1 ? 'Space' : 'Spaces'}
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

          {/* Sort & Page size controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-sky-50 rounded-lg border border-sky-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SpaceSortBy)
                  setPage(1)
                }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
              >
                {SPACE_SORT_BY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as SortOrder)
                  setPage(1)
                }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                Per page
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
              >
                {SPACE_PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
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
                  onEdit={setSpaceToEdit}
                  onDelete={handleDeleteSpace}
                  isDeleting={
                    deleteSpaceMutation.isPending &&
                    spaceToDelete?.id === space.id
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 0 && !isLoading && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-slate-600 text-sm">
                Showing {start} to {end} of {total} spaces
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

      <SpaceFormModal
        isOpen={isCreateModalOpen || !!spaceToEdit}
        onClose={closeSpaceForm}
        onSubmit={handleSpaceFormSubmit}
        mode={spaceToEdit ? 'edit' : 'create'}
        space={spaceToEdit}
        isSubmitting={createSpace.isPending || updateSpace.isPending}
      />

      <DeleteSpaceConfirmModal
        isOpen={!!spaceToDelete}
        onClose={() => setSpaceToDelete(null)}
        onConfirm={confirmDeleteSpace}
        space={spaceToDelete}
        isDeleting={deleteSpaceMutation.isPending}
        error={deleteSpaceMutation.error}
      />
    </div>
  )
}
