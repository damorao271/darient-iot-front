import type { Space } from '../types/spaces.types'
import { formatDateTimeRange } from '../utils/date'

interface SpaceCardProps {
  space: Space
  timezone?: string
}

export function SpaceCard({ space, timezone }: SpaceCardProps) {
  const hasReservations = space.reservations?.length > 0

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-sky-600"
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
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium mb-1.5">
              {space.reference}
            </span>
            <h3 className="text-lg font-semibold text-slate-900">
              {space.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Capacity: {space.capacity} · {space.description}
            </p>
          </div>
        </div>
        {hasReservations ? (
          <div className="rounded-lg bg-sky-50 border border-sky-100 p-3 space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Upcoming Reservations
            </p>
            {space.reservations.slice(0, 3).map((res) => (
              <div
                key={res.id}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium">{res.clientEmail}</p>
                  <p className="text-xs text-slate-500">
                    {formatDateTimeRange(res.startAt, res.endAt, timezone)}
                  </p>
                </div>
              </div>
            ))}
            {space.reservations.length > 3 && (
              <p className="text-xs text-slate-500 pt-1">
                +{space.reservations.length - 3} more
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-400"
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
            No reservations
          </p>
        )}
      </div>
    </article>
  )
}
