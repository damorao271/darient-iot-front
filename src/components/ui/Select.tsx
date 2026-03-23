import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, children, className, disabled, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    const baseClasses =
      'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors'
    const stateClasses = disabled
      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
      : error
        ? 'border-red-400 bg-red-50 focus:ring-red-300/30 focus:border-red-400 text-slate-800'
        : 'border-slate-200 bg-white focus:ring-violet-500/30 focus:border-violet-400 text-slate-800'

    return (
      <div className="relative flex flex-col gap-1">
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          {...props}
          className={[baseClasses, stateClasses, className].filter(Boolean).join(' ')}
        >
          {children}
        </select>
        {error && (
          <p className="absolute left-0 top-full mt-0.5 z-10 text-xs text-red-600 bg-white/95">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
