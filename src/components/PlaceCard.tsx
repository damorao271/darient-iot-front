import type { Place } from '../types/places.types'

function formatSpaces(place: Place): string {
  const count = place.spaces ?? place.units ?? place.buildings ?? 0
  if (count <= 0) return '—'
  return count === 1 ? '1 Unit' : `${count} Units`
}

function getStatusDisplay(place: Place): {
  label: string
  variant: 'green' | 'red'
} {
  if (place.capacityPercentage != null) {
    return { label: `${place.capacityPercentage}% CAPACITY`, variant: 'green' }
  }
  const status = String(place.status ?? '').toLowerCase()
  if (status === 'maintenance') return { label: 'MAINTENANCE', variant: 'red' }
  if (status === 'available') return { label: 'AVAILABLE', variant: 'green' }
  return { label: status || '—', variant: 'green' }
}

interface PlaceCardProps {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  const status = getStatusDisplay(place)
  const imageUrl = place.imageUrl ?? place.image

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
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
        )}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
            status.variant === 'red'
              ? 'bg-red-50 text-red-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status.variant === 'red' ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          />
          {status.label}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {place.name}
        </h3>
        <div className="flex items-start gap-2 text-slate-600 text-sm mb-4">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0 text-slate-400"
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
          <span>
            Location: {place?.latitude}, {place?.longitude} : Address:{' '}
            <b>Mockup Address</b>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {/* <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium mb-0.5">
              Total Area
            </div>
            <div className="text-slate-900 font-medium">
              {formatArea(place)}
            </div>
          </div> */}
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium mb-0.5">
              Spaces
            </div>
            <div className="text-slate-900 font-medium">
              {formatSpaces(place)}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="w-full py-2 px-4 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          View Spaces →
        </button>
      </div>
    </article>
  )
}
