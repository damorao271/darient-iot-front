import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  /** When false, Escape and backdrop click do not close the modal */
  canClose?: boolean
  children: React.ReactNode
  /** Optional class for the inner content wrapper (the dialog panel) */
  contentClassName?: string
}

export function BaseModal({
  isOpen,
  onClose,
  canClose = true,
  children,
  contentClassName,
}: BaseModalProps) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && canClose) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, canClose, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={canClose ? onClose : undefined}
      />

      <div
        className={`relative bg-white rounded-xl shadow-xl w-full max-w-md ${contentClassName ?? ''}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
