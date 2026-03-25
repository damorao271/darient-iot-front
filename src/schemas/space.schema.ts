import { z } from 'zod'

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, { error: 'Required' })
    .max(100)
    .transform((v) => v.trim()),
  reference: z
    .string()
    .max(25)
    .optional()
    .transform((v) => v?.trim() || undefined),
  capacity: z
    .number({ error: 'Required' })
    .int()
    .positive({ error: 'Capacity must be greater than 0' }),
  description: z
    .string()
    .max(500)
    .optional()
    .transform((v) => v?.trim() || undefined),
})

/** Input shape – used by react-hook-form (before transforms) */
export type CreateSpaceFormInput = z.input<typeof createSpaceSchema>
/** Output shape – used by the API call (after transforms) */
export type CreateSpaceFormValues = z.output<typeof createSpaceSchema>

/** Empty form defaults for create/edit modals */
export const EMPTY_SPACE_FORM_INPUT: CreateSpaceFormInput = {
  name: '',
  reference: '',
  capacity: 1,
  description: '',
}
