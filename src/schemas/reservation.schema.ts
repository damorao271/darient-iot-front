import { z } from 'zod'

/** Time string in HH:mm format (24h), 00:00 = midnight */
export const timeSchema = z
  .string()
  .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, { message: 'Invalid time (use HH:mm)' })

/** Minutes since midnight; 00:00 = 1440 (end of day) */
function timeToMinutes(t: string): number {
  if (t === '00:00') return 24 * 60
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export const createReservationSchema = z
  .object({
    clientEmail: z.string().email(),
    reservationDate: z
      .string()
      .min(1, 'Required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date (YYYY-MM-DD)' }),
    startTime: z.union([z.literal(''), timeSchema]),
    endTime: timeSchema,
  })
  .refine((data) => data.startTime !== '', {
    message: 'Start time is required',
    path: ['startTime'],
  })
  .refine((data) => timeToMinutes(data.startTime) < timeToMinutes(data.endTime), {
    message: 'End time must be later than start time',
    path: ['endTime'],
  })

/** Input shape – used by react-hook-form (before transforms) */
export type CreateReservationFormInput = z.input<typeof createReservationSchema>
/** Output shape – used by the API call (after transforms) */
export type CreateReservationFormValues = z.output<typeof createReservationSchema>
