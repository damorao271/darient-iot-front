import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createSpaceSchema,
  EMPTY_SPACE_FORM_INPUT,
  type CreateSpaceFormInput,
  type CreateSpaceFormValues,
} from '../schemas/space.schema'
import type { Space } from '../types/spaces.types'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { BaseModal } from './ui/BaseModal'

export type SpaceFormMode = 'create' | 'edit'

interface SpaceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CreateSpaceFormValues) => void
  mode: SpaceFormMode
  space?: Space | null
  isSubmitting?: boolean
}

export function SpaceFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  space,
  isSubmitting = false,
}: SpaceFormModalProps) {
  const isEdit = mode === 'edit'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSpaceFormInput, unknown, CreateSpaceFormValues>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: EMPTY_SPACE_FORM_INPUT,
  })

  useEffect(() => {
    if (!isOpen) {
      reset(EMPTY_SPACE_FORM_INPUT)
      return
    }
    if (isEdit && space) {
      reset({
        name: space.name,
        reference: space.reference ?? '',
        capacity: space.capacity,
        description: space.description ?? '',
      })
    } else {
      reset(EMPTY_SPACE_FORM_INPUT)
    }
  }, [isOpen, isEdit, space, reset])

  if (!isOpen) return null

  const title = isEdit ? 'Edit Space' : 'Create New Space'
  const submitLabel = isSubmitting
    ? isEdit
      ? 'Saving...'
      : 'Creating...'
    : isEdit
      ? 'Save Changes'
      : 'Create Space'

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      canClose={!isSubmitting}
    >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2
            id="space-form-title"
            className="text-lg font-semibold text-slate-900"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="px-6 py-5 flex flex-col gap-4">
            <Input
              label="Name *"
              placeholder="e.g. Boardroom B"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Reference"
                placeholder="REF-001"
                error={errors.reference?.message}
                {...register('reference')}
              />
              <Input
                label="Capacity *"
                type="number"
                min={1}
                placeholder="10"
                error={errors.capacity?.message}
                {...register('capacity', { valueAsNumber: true })}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Describe the amenities and purpose of this space..."
              error={errors.description?.message}
              {...register('description')}
            />
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
              {submitLabel}
            </button>
          </div>
        </form>
    </BaseModal>
  )
}
