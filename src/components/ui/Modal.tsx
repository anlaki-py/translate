import type { ReactNode } from 'react'

export interface ModalProps {
  show: boolean
  onClose: () => void
  children: ReactNode
  width?: string
  maxHeight?: string
}

/**
* Base modal wrapper with glass styling and animations.
* Use for all modals in the app to maintain consistent appearance.
*/
export function Modal({
  show,
  onClose,
  children,
  width = 'w-[85%] max-w-[360px]',
  maxHeight = 'max-h-[70vh]',
}: ModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/40 z-[100] flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`${width} ${maxHeight} bg-surface rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/5 transition-transform duration-300 ${show ? 'scale-100' : 'scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {show && children}
      </div>
    </div>
  )
}

export default Modal
