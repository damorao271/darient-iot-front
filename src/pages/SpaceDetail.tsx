import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSpace } from '../hooks/useSpace'
import { useAuth } from '../hooks/useAuth'
import { useCreateReservation } from '../hooks/useCreateReservation'
import { useReservations } from '../hooks/useReservations'
import { useCancelReservation } from '../hooks/useCancelReservation'
import { useUpdateReservation } from '../hooks/useUpdateReservation'
import { AppSidebar } from '../components/AppSidebar'
import { AppHeader } from '../components/AppHeader'
import { CreateReservationForm } from '../components/CreateReservationForm'
import { ReservationsTable } from '../components/ReservationsTable'
import { ReservationsTableFilters } from '../components/ReservationsTableFilters'
import { ApiErrorAlert } from '../components/ApiErrorAlert'
import { CancelReservationConfirmModal } from '../components/CancelReservationConfirmModal'
import { EditReservationModal } from '../components/EditReservationModal'
import { LocationModal } from '../components/LocationModal'
import { useEffect, useRef } from 'react'
import {
  formatDateTimeRange,
  getDurationHours,
  getCurrentMonthDateRange,
} from '../utils/date'
import type { ReservationListItem } from '../types/reservation.types'
import type { CreateReservationFormValues } from '../schemas/reservation.schema'
import { isValidEmail } from '../utils/string'
import { showErrorToast } from '../utils/toast'

type SortOrderOption = 'asc' | 'desc'

const DEFAULT_FILTERS = () => ({
  searchEmail: '',
  fromDate: getCurrentMonthDateRange().fromDate,
  toDate: getCurrentMonthDateRange().toDate,
  sortOrder: 'asc' as SortOrderOption,
  pageSize: 10,
})

export function SpaceDetail() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [formFilters, setFormFilters] = useState(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [reservationsPage, setReservationsPage] = useState(1)
  const [searchTrigger, setSearchTrigger] = useState(0)
  const [searchEmailError, setSearchEmailError] = useState<string | undefined>()
  const [dateRangeError, setDateRangeError] = useState<string | undefined>()

  const handleSearch = () => {
    const trimmed = formFilters.searchEmail.trim()
    if (trimmed && !isValidEmail(formFilters.searchEmail)) {
      setSearchEmailError('Enter a valid email address')
      return
    }
    setSearchEmailError(undefined)

    if (formFilters.fromDate > formFilters.toDate) {
      setDateRangeError('From date must be before or equal to to date')
      return
    }
    setDateRangeError(undefined)

    setAppliedFilters({ ...formFilters })
    setReservationsPage(1)
    setSearchTrigger((t) => t + 1)
  }

  const handleClearFilters = () => {
    const defaults = DEFAULT_FILTERS()
    setFormFilters(defaults)
    setAppliedFilters(defaults)
    setReservationsPage(1)
    setSearchEmailError(undefined)
    setDateRangeError(undefined)
  }

  const clientEmailForApi = appliedFilters.searchEmail.trim()
    ? isValidEmail(appliedFilters.searchEmail)
      ? appliedFilters.searchEmail.trim()
      : undefined
    : undefined

  const { data: space, isLoading, error } = useSpace(spaceId)
  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
    refetch: refetchReservations,
  } = useReservations({
    spaceId: spaceId ?? '',
    page: reservationsPage,
    pageSize: appliedFilters.pageSize,
    sortBy: 'startAt',
    sortOrder: appliedFilters.sortOrder,
    fromDate: appliedFilters.fromDate,
    toDate: appliedFilters.toDate,
    clientEmail: clientEmailForApi,
    searchTrigger,
  })

  const lastSuccessDataRef = useRef<typeof reservationsData>(reservationsData)
  useEffect(() => {
    if (reservationsData) lastSuccessDataRef.current = reservationsData
  }, [reservationsData])

  const displayData =
    reservationsData ??
    (reservationsError ? lastSuccessDataRef.current : undefined)

  useEffect(() => {
    if (reservationsError) showErrorToast(reservationsError)
  }, [reservationsError])

  const createReservation = useCreateReservation(spaceId ?? '')
  const place = space?.place
  const reservations = space?.reservations ?? []
  const timezone = place?.timezone
  const [reservationToCancel, setReservationToCancel] =
    useState<ReservationListItem | null>(null)
  const [reservationToEdit, setReservationToEdit] =
    useState<ReservationListItem | null>(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const cancelReservationMutation = useCancelReservation({
    showErrorToast: false,
  })
  const updateReservationMutation = useUpdateReservation({
    showErrorToast: false,
  })

  const handleConfirmCancelReservation = (id: string) => {
    cancelReservationMutation.mutate(id, {
      onSuccess: () => setReservationToCancel(null),
    })
  }

  const handleConfirmEditReservation = (
    reservationId: string,
    values: CreateReservationFormValues,
  ) => {
    updateReservationMutation.mutate(
      {
        id: reservationId,
        body: {
          clientEmail: values.clientEmail,
          reservationDate: `${values.reservationDate}T00:00:00.000Z`,
          startTime: values.startTime,
          endTime: values.endTime,
        },
      },
      {
        onSuccess: () => setReservationToEdit(null),
      },
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <p className="text-slate-600">Failed to load space details.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <AppHeader />

        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="max-w-6xl mx-auto animate-pulse space-y-6">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded w-1/2" />
              <div className="h-24 bg-slate-200 rounded" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl" />
                <div className="h-96 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ) : space ? (
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs font-semibold text-violet-600 uppercase tracking-wider mb-4">
                <Link to="/" className="hover:text-violet-700">
                  Locations
                </Link>
                {place && (
                  <>
                    <span className="text-slate-400">/</span>
                    <Link
                      to={`/places/${place.id}/spaces`}
                      className="hover:text-violet-700"
                    >
                      {place.name}
                    </Link>
                  </>
                )}
                <span className="text-slate-400">/</span>
                <span className="text-slate-700">{space.reference}</span>
              </nav>

              {/* Place info: name, timezone, location */}
              {place && (
                <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-slate-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span className="font-medium text-slate-900">
                        {place.name}
                      </span>
                    </div>
                    {place.timezone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg
                          className="w-4 h-4 text-slate-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{place.timezone}</span>
                      </div>
                    )}
                    {place.latitude != null && place.longitude != null && (
                      <button
                        type="button"
                        onClick={() => setIsLocationModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-medium"
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Show Location
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Space info + bookings */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Header with title, description, amenities, image */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                          {space.name}
                        </h1>
                        {isAdmin && (
                          <Link
                            to={`/spaces/${spaceId}/iot`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            IoT Dashboard
                          </Link>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {space.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {space.capacity} Capacity
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
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
                              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1 4l2-2m0 0l2 2m-2-2v10a2 2 0 002 2h10a2 2 0 002-2V4"
                            />
                          </svg>
                          Wi-Fi
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
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
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Display
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 md:w-72">
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-200">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500 text-white">
                          Available Now
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Bookings */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                      <h2 className="font-semibold text-slate-900">
                        Upcoming Bookings
                      </h2>
                      <span className="text-xs font-medium text-slate-500 uppercase">
                        Today
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {reservations.length === 0 ? (
                        <p className="px-5 py-8 text-slate-500 text-sm text-center">
                          No upcoming bookings
                        </p>
                      ) : (
                        reservations.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50"
                          >
                            <div className="w-14 shrink-0 text-sm font-medium text-slate-700">
                              {new Date(res.startAt).toLocaleTimeString(
                                undefined,
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  ...(timezone && { timeZone: timezone }),
                                },
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-900 truncate">
                                {res.clientEmail}
                              </p>
                              <p className="text-xs text-slate-500">
                                {getDurationHours(res.startAt, res.endAt)} hour
                                {getDurationHours(res.startAt, res.endAt) !== 1
                                  ? 's'
                                  : ''}{' '}
                                ·{' '}
                                {formatDateTimeRange(
                                  res.startAt,
                                  res.endAt,
                                  timezone,
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Create Reservation */}
                <div className="lg:col-span-1">
                  <CreateReservationForm
                    onSubmit={async (values) => {
                      await createReservation.mutateAsync(values)
                    }}
                    isSubmitting={createReservation.isPending}
                  />
                </div>
              </div>

              {/* Reservations Table - Full width below both columns */}
              <div className="mt-8">
                <h2 className="font-semibold text-slate-900 mb-3">
                  Reservations
                </h2>
                <ReservationsTableFilters
                  searchEmail={formFilters.searchEmail}
                  searchEmailError={searchEmailError}
                  onSearchEmailChange={(v) =>
                    setFormFilters((prev) => ({ ...prev, searchEmail: v }))
                  }
                  sortOrder={formFilters.sortOrder}
                  pageSize={formFilters.pageSize}
                  fromDate={formFilters.fromDate}
                  toDate={formFilters.toDate}
                  onSortOrderChange={(v) =>
                    setFormFilters((prev) => ({
                      ...prev,
                      sortOrder: v as SortOrderOption,
                    }))
                  }
                  onPageSizeChange={(v) =>
                    setFormFilters((prev) => ({ ...prev, pageSize: v }))
                  }
                  onFromDateChange={(v) => {
                    setDateRangeError(undefined)
                    setFormFilters((prev) => ({ ...prev, fromDate: v }))
                  }}
                  onToDateChange={(v) => {
                    setDateRangeError(undefined)
                    setFormFilters((prev) => ({ ...prev, toDate: v }))
                  }}
                  dateRangeError={dateRangeError}
                  onSearch={handleSearch}
                  onClearFilters={handleClearFilters}
                />
                {!displayData && reservationsLoading ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-3">
                    <div className="animate-pulse p-8 space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="h-4 bg-slate-200 rounded w-3/5" />
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </div>
                  </div>
                ) : reservationsError && !displayData ? (
                  <div className="mt-3">
                    <ApiErrorAlert
                      error={reservationsError}
                      onRetry={() => refetchReservations()}
                    />
                  </div>
                ) : displayData ? (
                  <div className="mt-3">
                    <ReservationsTable
                      items={displayData.items}
                      meta={displayData.meta}
                      timezone={place?.timezone}
                      onPageChange={setReservationsPage}
                      onEditReservation={(res) => {
                        updateReservationMutation.reset()
                        setReservationToEdit(res)
                      }}
                      onCancelReservation={(res) => setReservationToCancel(res)}
                      cancelReservationId={
                        cancelReservationMutation.isPending
                          ? reservationToCancel?.id
                          : undefined
                      }
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <CancelReservationConfirmModal
        isOpen={!!reservationToCancel}
        onClose={() => setReservationToCancel(null)}
        onConfirm={handleConfirmCancelReservation}
        reservation={reservationToCancel}
        timezone={place?.timezone}
        isDeleting={cancelReservationMutation.isPending}
        error={cancelReservationMutation.error}
      />

      <EditReservationModal
        isOpen={!!reservationToEdit}
        onClose={() => setReservationToEdit(null)}
        onSubmit={handleConfirmEditReservation}
        reservation={reservationToEdit}
        timezone={place?.timezone}
        isSubmitting={updateReservationMutation.isPending}
        error={updateReservationMutation.error}
      />

      {place?.latitude != null && place?.longitude != null && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          latitude={place.latitude}
          longitude={place.longitude}
          placeName={place.name}
        />
      )}
    </div>
  )
}
