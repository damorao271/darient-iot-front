import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    const baseClasses =
      'w-full px-3 py-2 rounded-lg border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors'
    const stateClasses = error
      ? 'border-red-400 bg-red-50 focus:ring-red-300/30 focus:border-red-400'
      : 'border-slate-200 bg-white focus:ring-violet-500/30 focus:border-violet-400'

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[baseClasses, stateClasses, className].filter(Boolean).join(' ')}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
