import { useEffect } from 'react'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  latitude: number
  longitude: number
  placeName?: string
}

export function LocationModal({
  isOpen,
  onClose,
  latitude,
  longitude,
  placeName,
}: LocationModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="Close modal"
      />
      <div
        className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h2 id="location-modal-title" className="text-lg font-semibold text-slate-900">
            {placeName ? `${placeName} – Location` : 'Location'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="aspect-[4/3] min-h-[300px]">
          <iframe
            title="Location on Google Maps"
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
        <div className="px-4 py-3 border-t border-slate-200 flex justify-end">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  )
}
