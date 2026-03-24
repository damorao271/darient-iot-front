import type { ReservationListItem } from '../types/reservation.types'
import { formatDateOnly, formatTimeRange } from '../utils/date'
import { getUserFriendlyMessage } from '../utils/error-messages'
import { BaseModal } from './ui/BaseModal'

interface CancelReservationConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reservationId: string) => void
  reservation: ReservationListItem | null
  timezone?: string
  isDeleting?: boolean
  /** When set, modal shows inline error and Cancel becomes Retry */
  error?: unknown
}

export function CancelReservationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  reservation,
  timezone,
  isDeleting = false,
  error,
}: CancelReservationConfirmModalProps) {
  const canClose = !isDeleting
  const errorMessage = error ? getUserFriendlyMessage(error) : null

  function handleConfirm() {
    if (!reservation) return
    onConfirm(reservation.id)
  }

  const when = reservation
    ? `${formatDateOnly(reservation.reservationDate, reservation.timezone || timezone)} ${formatTimeRange(reservation.startAt, reservation.endAt, reservation.timezone || timezone)}`
    : ''

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      canClose={canClose}
      data-cy="cancel-reservation-modal"
    >
      <div className="px-6 py-5">
        <h2
          id="cancel-reservation-title"
          className="text-lg font-semibold text-slate-900 mb-2"
        >
          Cancel Reservation
        </h2>
        <p
          className="text-slate-600 text-sm"
          id="cancel-reservation-description"
        >
          Are you sure you want to cancel the reservation for{' '}
          <span className="font-medium text-slate-900">
            {reservation?.clientEmail ?? ''}
          </span>
          {when && (
            <>
              {' '}
              on <span className="font-medium text-slate-900">{when}</span>?
            </>
          )}{' '}
          This action cannot be undone.
        </p>
        {errorMessage && (
          <div
            className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDeleting && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isDeleting ? 'Cancelling...' : errorMessage ? 'Retry' : 'Cancel reservation'}
        </button>
      </div>
    </BaseModal>
  )
}
