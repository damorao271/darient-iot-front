import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReservationListItem } from '../types/reservation.types'
import {
  createReservationSchema,
  type CreateReservationFormInput,
  type CreateReservationFormValues,
} from '../schemas/reservation.schema'
import { isTimeAfter, START_TIME_OPTIONS, END_TIME_OPTIONS, extractTimeHHmm } from '../utils/time'
import { getUserFriendlyMessage } from '../utils/error-messages'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { BaseModal } from './ui/BaseModal'

interface EditReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (
    reservationId: string,
    values: CreateReservationFormValues,
  ) => Promise<void> | void
  reservation: ReservationListItem | null
  timezone?: string
  isSubmitting?: boolean
  error?: unknown
}

export function EditReservationModal({
  isOpen,
  onClose,
  onSubmit,
  reservation,
  timezone,
  isSubmitting = false,
  error,
}: EditReservationModalProps) {
  const canClose = !isSubmitting
  const errorMessage = error ? getUserFriendlyMessage(error) : null

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateReservationFormInput, unknown, CreateReservationFormValues>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: { clientEmail: '', reservationDate: '', startTime: '', endTime: '' },
  })

  const startTime = watch('startTime')
  const endTime = watch('endTime')

  useEffect(() => {
    if (startTime && endTime && !isTimeAfter(startTime, endTime)) {
      setValue('endTime', '')
    }
  }, [startTime, endTime, setValue])

  useEffect(() => {
    if (reservation) {
      const tz = reservation.timezone || timezone
      reset({
        clientEmail: reservation.clientEmail,
        reservationDate: reservation.reservationDate,
        startTime: extractTimeHHmm(reservation.startAt, tz),
        endTime: extractTimeHHmm(reservation.endAt, tz),
      })
    }
  }, [reservation, timezone, reset])

  async function handleFormSubmit(values: CreateReservationFormValues) {
    if (!reservation) return
    await onSubmit(reservation.id, values)
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      canClose={canClose}
      contentClassName="max-w-lg"
    >
      <div className="px-6 py-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Edit Reservation</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Update the details for this reservation.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="px-6 py-5 space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            error={errors.clientEmail?.message}
            {...register('clientEmail')}
          />
          <Input
            label="Booking Date"
            type="date"
            error={errors.reservationDate?.message}
            {...register('reservationDate')}
          />
          <Select
            label="Start Time"
            error={errors.startTime?.message}
            {...register('startTime')}
          >
            <option value="">Select start time</option>
            {START_TIME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            label="End Time"
            error={errors.endTime?.message}
            disabled={!startTime}
            {...register('endTime')}
          >
            <option value="">Select end time</option>
            {END_TIME_OPTIONS.filter(
              (opt) =>
                !startTime ||
                (opt.value !== '' && isTimeAfter(startTime, opt.value)),
            ).map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          {errorMessage && (
            <div
              className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm"
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
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
            {isSubmitting ? 'Saving...' : errorMessage ? 'Retry' : 'Save Changes'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
