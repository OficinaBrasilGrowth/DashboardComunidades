'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

// Primitive de botão — extraído da repetição real de vários <button> crus
// já espalhados pelo sistema, não inventado do zero. `rounded-lg` já
// dominava esmagadoramente entre as ocorrências catalogadas, então virou
// o radius padrão daqui — não uma escolha nova.
//
// Variantes seguem a sugestão de revisão: primary, secondary, outline,
// ghost, destructive. Tamanhos: sm, md, lg. Usa <button> nativo (não uma
// simulação com <div role="button">), preservando foco/Enter/Space de
// graça, mesmo princípio já aplicado em Checkbox/Switch/RadioGroup.
//
// Anel de foco usa var(--focus-ring-primary)/var(--focus-ring-destructive)
// (2F, criados nesta mesma sprint) — não um valor novo inventado aqui.

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; gap: string }> = {
  sm: { padding: '0.375rem 0.75rem', fontSize: '0.8125rem', gap: '0.375rem' },
  md: { padding: '0.5rem 0.875rem', fontSize: '0.875rem', gap: '0.5rem' },
  lg: { padding: '0.625rem 1.125rem', fontSize: '0.9375rem', gap: '0.5rem' },
}

function variantStyle(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' }
    case 'secondary':
      return { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid transparent' }
    case 'outline':
      return { backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }
    case 'ghost':
      return { backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid transparent' }
    case 'destructive':
      return { backgroundColor: 'var(--destructive-surface)', color: 'var(--destructive-surface-foreground)', border: '1px solid transparent' }
  }
}

function focusRingFor(variant: ButtonVariant): string {
  return variant === 'destructive' ? 'var(--focus-ring-destructive)' : 'var(--focus-ring-primary)'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, icon, children, disabled, className = '', style, onFocus, onBlur, ...rest },
  ref
) {
  const isDisabled = disabled || loading
  const { padding, fontSize, gap } = sizeStyles[size]

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-shadow whitespace-nowrap ${
        variant === 'ghost' || variant === 'outline' ? 'hover:bg-muted' : ''
      } ${className}`}
      style={{
        padding,
        fontSize,
        gap,
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ...variantStyle(variant),
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = focusRingFor(variant)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        onBlur?.(e)
      }}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="inline-block rounded-full animate-spin"
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            opacity: 0.7,
          }}
        />
      ) : (
        icon && <span aria-hidden="true" className="inline-flex shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
})
