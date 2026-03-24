import { z } from 'zod'

export const desiredConfigSchema = z.object({
  co2AlertThreshold: z
    .number({ error: 'Required' })
    .int()
    .min(400, 'CO₂ threshold must be between 400 and 5000 ppm')
    .max(5000, 'CO₂ threshold must be between 400 and 5000 ppm'),
  samplingIntervalSec: z
    .number({ error: 'Required' })
    .int()
    .min(1, 'Sampling interval must be between 1 and 3600 seconds')
    .max(3600, 'Sampling interval must be between 1 and 3600 seconds'),
})

/** Input shape – used by react-hook-form (before transforms) */
export type DesiredConfigFormInput = z.input<typeof desiredConfigSchema>
/** Output shape – used by the API call (after transforms) */
export type DesiredConfigFormValues = z.output<typeof desiredConfigSchema>
