import type { ButtonHTMLAttributes, ReactElement } from 'react'
import { cloneElement } from 'react'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement
  size?: 'sm' | 'md' | 'lg'
  floating?: boolean
  enableHaptic?: boolean
}

const sizeClasses = {
  sm: 'w-9 h-9 rounded-xl',
  md: 'w-11 h-11 rounded-2xl',
  lg: 'w-14 h-14 rounded-3xl',
}

const iconSizeClasses = {
  sm: 'w-[18px] h-[18px]',
  md: 'w-[22px] h-[22px]',
  lg: 'w-7 h-7',
}

export function IconButton({
  icon,
  size = 'md',
  floating = false,
  enableHaptic = true,
  className = '',
  disabled = false,
  onClick,
  ...props
}: IconButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    if (enableHaptic) {
      navigator.vibrate?.(10)
    }
    
    if (onClick) {
      onClick(e)
    }
  }

  const iconWithProps = cloneElement(icon, {
    className: `${icon.props.className || ''} ${iconSizeClasses[size]} text-textSecondary transition-colors group-active:text-white`,
  })

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        glass-btn ${sizeClasses[size]} flex items-center justify-center
        active:scale-95 transition-transform cursor-pointer
        disabled:opacity-50 disabled:pointer-events-none
        ${floating ? 'shadow-lg' : ''}
        group
        ${className}
      `}
      {...props}
    >
      {iconWithProps}
    </button>
  )
}

export default IconButton
