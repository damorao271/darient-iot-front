import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createReservationSchema,
  type CreateReservationFormInput,
  type CreateReservationFormValues,
} from '../schemas/reservation.schema'
import { CREATE_RESERVATION_DEFAULT_VALUES } from '../constants/reservation'
import {
  isTimeAfter,
  START_TIME_OPTIONS,
  END_TIME_OPTIONS,
} from '../utils/time'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface CreateReservationFormProps {
  onSubmit: (values: CreateReservationFormValues) => void | Promise<void>
  isSubmitting?: boolean
}

export function CreateReservationForm({
  onSubmit,
  isSubmitting = false,
}: CreateReservationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateReservationFormInput, unknown, CreateReservationFormValues>(
    {
      resolver: zodResolver(createReservationSchema),
      defaultValues: CREATE_RESERVATION_DEFAULT_VALUES,
    },
  )

  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const isEndTimeDisabled = !startTime

  useEffect(() => {
    if (startTime && endTime && !isTimeAfter(startTime, endTime)) {
      setValue('endTime', '')
    }
  }, [startTime, endTime, setValue])

  return (
    <div data-cy="create-reservation-form" className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
      <h3 className="font-semibold text-slate-900 mb-1">Create Reservation</h3>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
          reset(CREATE_RESERVATION_DEFAULT_VALUES)
        })}
        noValidate
      >
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
          min={new Date().toISOString().split('T')[0]}
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
          disabled={isEndTimeDisabled}
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400 text-center">
        By booking, you agree to our space policy.
      </p>
    </div>
  )
}
