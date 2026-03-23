import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Place } from '../types/places.types'
import { LocationModal } from './LocationModal'

interface PlaceCardProps {
  place: Place
}

export function PlaceCard({ place }: PlaceCardProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] bg-slate-100">
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
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Available
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
            {place?.latitude && place?.longitude ? (
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="cursor-pointer inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 hover:underline text-left"
              >
                Show Location
              </button>
            ) : (
              <></>
            )}
            : Address: <b>Mockup Address</b>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium mb-0.5">
              Total Capacity
            </div>
            <div className="text-slate-900 font-medium">
              {place?.spaces?.reduce((acc, space) => acc + space.capacity, 0)}{' '}
              people
            </div>
          </div>
          <div>
            <div className="text-slate-500 uppercase tracking-wide text-xs font-medium mb-0.5">
              Spaces Available
            </div>
            <div className="text-slate-900 font-medium">
              {place?.spaces?.length}
            </div>
          </div>
        </div>
        <Link
          to={`/places/${place.id}/spaces`}
          className="block w-full py-2 px-4 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors text-center"
        >
          View Spaces →
        </Link>
      </div>
      {place?.latitude != null && place?.longitude != null && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          latitude={place.latitude}
          longitude={place.longitude}
          placeName={place.name}
        />
      )}
    </article>
  )
}
