import { useState } from 'react'
import { ApiError } from '../api/errors'
import { getUserFriendlyMessage } from '../utils/error-messages'
import { formatValidationDetails } from '../utils/error-messages'

export interface ApiErrorAlertProps {
  error: unknown
  onRetry?: () => void
  /** @default 'inline' */
  variant?: 'inline' | 'banner'
}

export function ApiErrorAlert({ error, onRetry, variant = 'inline' }: ApiErrorAlertProps) {
  const [showDetails, setShowDetails] = useState(false)
  const message = getUserFriendlyMessage(error)

  const apiError = error instanceof ApiError ? error : null
  const hasValidationDetails = apiError?.details && apiError.details.length > 0
  const hasOtherDetails = apiError && (apiError.backendError || apiError.path)
  const hasDetails = hasValidationDetails || hasOtherDetails

  const baseClasses =
    variant === 'banner'
      ? 'rounded-none border-x-0 border-t-0 border-b border-red-200'
      : 'rounded-lg border border-red-200'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mb-6 p-4 bg-red-50 text-red-800 ${baseClasses}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex shrink-0 text-red-500" aria-hidden>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
          {hasDetails && (
            <>
              {hasValidationDetails && (
                <p className="mt-2 text-xs text-red-600/90 whitespace-pre-line">
                  {formatValidationDetails(apiError!.details!)}
                </p>
              )}
              {showDetails && hasOtherDetails ? (
                <div className="mt-2 text-xs text-red-600/90 space-y-0.5">
                  {apiError?.backendError && <p>Error: {apiError.backendError}</p>}
                  {apiError?.path && <p>Path: {apiError.path}</p>}
                </div>
              ) : hasOtherDetails ? (
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="mt-1 text-xs font-medium text-red-600 underline hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                >
                  Show details
                </button>
              ) : null}
            </>
          )}
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
