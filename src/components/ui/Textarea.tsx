import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    const baseClasses =
      'w-full px-3 py-2 rounded-lg border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none'
    const stateClasses = error
      ? 'border-red-400 bg-red-50 focus:ring-red-300/30 focus:border-red-400'
      : 'border-slate-200 bg-white focus:ring-violet-500/30 focus:border-violet-400'

    return (
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          {...props}
          className={[baseClasses, stateClasses, className].filter(Boolean).join(' ')}
        />
        {error && (
          <p className="absolute left-0 top-full mt-0.5 z-10 text-xs text-red-600 bg-white/95">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
