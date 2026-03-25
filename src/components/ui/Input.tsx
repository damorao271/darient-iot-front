import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, disabled, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    const baseClasses =
      'w-full px-3 py-2 rounded-lg border text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors'
    const stateClasses = disabled
      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
      : error
        ? 'border-red-400 bg-red-50 focus:ring-red-300/30 focus:border-red-400 text-slate-800'
        : 'border-slate-200 bg-white focus:ring-violet-500/30 focus:border-violet-400 text-slate-800'

    return (
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
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

Input.displayName = 'Input'
