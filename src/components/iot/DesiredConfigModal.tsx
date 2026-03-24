import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '../ui/BaseModal'
import { Input } from '../ui/Input'
import {
  desiredConfigSchema,
  type DesiredConfigFormInput,
  type DesiredConfigFormValues,
} from '../../schemas/desiredConfig.schema'
import type { DeviceDesired } from '../../types/iot.types'

interface DesiredConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (body: DesiredConfigFormValues) => void
  current: DeviceDesired | null
  isSubmitting: boolean
  error: unknown
}

export function DesiredConfigModal({
  isOpen,
  onClose,
  onSubmit,
  current,
  isSubmitting,
  error,
}: DesiredConfigModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DesiredConfigFormInput, unknown, DesiredConfigFormValues>({
    resolver: zodResolver(desiredConfigSchema),
    defaultValues: {
      co2AlertThreshold: current?.co2AlertThreshold ?? 1000,
      samplingIntervalSec: current?.samplingIntervalSec ?? 10,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        co2AlertThreshold: current?.co2AlertThreshold ?? 1000,
        samplingIntervalSec: current?.samplingIntervalSec ?? 10,
      })
    }
  }, [isOpen, current, reset])

  const apiErrorMessage =
    error instanceof Error ? error.message : error ? String(error) : null

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} canClose={!isSubmitting}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Device Configuration
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            Update the desired configuration. Changes will be published via MQTT
            to the device.
          </p>

          <div className="space-y-4">
            <Input
              label="CO₂ Alert Threshold (ppm)"
              type="number"
              min={400}
              max={5000}
              error={errors.co2AlertThreshold?.message}
              disabled={isSubmitting}
              {...register('co2AlertThreshold', { valueAsNumber: true })}
            />
            <Input
              label="Sampling Interval (seconds)"
              type="number"
              min={1}
              max={3600}
              error={errors.samplingIntervalSec?.message}
              disabled={isSubmitting}
              {...register('samplingIntervalSec', { valueAsNumber: true })}
            />
          </div>

          {apiErrorMessage && (
            <p className="mt-3 text-sm text-red-600">{apiErrorMessage}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
              </svg>
            )}
            {isSubmitting ? 'Publishing...' : 'Publish Configuration'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
