import type { ReactNode } from 'react'

export interface ModalProps {
  show: boolean
  onClose: () => void
  children: ReactNode
  width?: string
  maxHeight?: string
}

/**
 * Base modal wrapper with glass styling.
 * Use for all modals in the app to maintain consistent appearance.
 */
export function Modal({
  show,
  onClose,
  children,
  width = 'w-[85%] max-w-[360px]',
  maxHeight = 'max-h-[70vh]',
}: ModalProps) {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`${width} ${maxHeight} bg-surface rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/5`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
