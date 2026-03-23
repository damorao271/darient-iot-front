import type { ReservationListItem } from '../types/reservation.types'
import { formatDateOnly, formatTimeRange } from '../utils/date'
import { getInitials } from '../utils/string'

interface ReservationsTableProps {
  items: ReservationListItem[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
  timezone?: string
  onPageChange?: (page: number) => void
  onCancelReservation?: (reservation: ReservationListItem) => void
  cancelReservationId?: string
}

export function ReservationsTable({
  items,
  meta,
  timezone,
  onPageChange,
  onCancelReservation,
  cancelReservationId,
}: ReservationsTableProps) {
  const { page, pageSize, total, totalPages } = meta
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Username
              </th>
              <th className="text-left px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Start & End Time
              </th>
              <th className="text-right px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-slate-500 text-sm"
                >
                  No reservations found
                </td>
              </tr>
            ) : (
              items.map((res) => {
                const isPast =
                  new Date(res.endAt).getTime() < Date.now()
                return (
                <tr
                  key={res.id}
                  className={`border-t border-slate-100 transition-colors ${
                    isPast
                      ? 'bg-slate-200 hover:bg-slate-300/80'
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm shrink-0">
                        {getInitials(res.clientEmail)}
                      </div>
                      <span className="font-medium text-slate-900">
                        {res.clientEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-700">
                    {formatDateOnly(res.reservationDate, res.timezone)}
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-sm">
                    {formatTimeRange(
                      res.startAt,
                      res.endAt,
                      res.timezone || timezone,
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Edit reservation"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelReservation?.(res)}
                        disabled={cancelReservationId === res.id}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Cancel reservation"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
              })
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-slate-50/50">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">{start}</span>–
            <span className="font-semibold">{end}</span> of{' '}
            <span className="font-semibold">{total}</span> reservations
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => onPageChange?.(pageNum)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      pageNum === page
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
