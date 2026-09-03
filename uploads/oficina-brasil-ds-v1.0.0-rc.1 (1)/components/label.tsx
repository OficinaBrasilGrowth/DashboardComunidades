import type { LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium block mb-1.5 ${className ?? ''}`}
      style={{ color: 'var(--foreground)' }}
      {...props}
    >
      {children}
      {required && (
        <span style={{ color: 'var(--destructive-text)' }} aria-hidden="true"> *</span>
      )}
    </label>
  )
}
