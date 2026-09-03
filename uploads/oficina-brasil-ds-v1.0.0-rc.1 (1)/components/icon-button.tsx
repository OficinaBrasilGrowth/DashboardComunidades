'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { ButtonVariant, ButtonSize } from './button'

// Variante circular do Button, só ícone — extraído dos 11 usos de
// `rounded-full` já catalogados nos botões existentes (Modal fechar,
// DropdownMenu trigger, etc.), cada um reimplementando radius/tamanho/
// hover próprio antes disso.
//
// `aria-label` é obrigatório no tipo (não opcional) de propósito — um
// botão só de ícone sem nome acessível é uma violação de acessibilidade
// real, não uma escolha de API. Sem isso, um leitor de tela não tem nada
// pra anunciar.

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon: ReactNode
  'aria-label': string
}

const sizeMap: Record<ButtonSize, number> = { sm: 28, md: 36, lg: 44 }

function variantStyle(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
    case 'secondary':
      return { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }
    case 'outline':
      return { backgroundColor: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }
    case 'ghost':
      return { backgroundColor: 'transparent', color: 'var(--muted-foreground)' }
    case 'destructive':
      return { backgroundColor: 'var(--destructive-surface)', color: 'var(--destructive-surface-foreground)' }
  }
}

function focusRingFor(variant: ButtonVariant): string {
  return variant === 'destructive' ? 'var(--focus-ring-destructive)' : 'var(--focus-ring-primary)'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', icon, disabled, className = '', style, onFocus, onBlur, ...rest },
  ref
) {
  const px = sizeMap[size]
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full shrink-0 transition-colors ${
        variant === 'ghost' || variant === 'outline' ? 'hover:bg-muted' : ''
      } ${className}`}
      style={{
        width: px,
        height: px,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
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
      <span aria-hidden="true" className="inline-flex">{icon}</span>
    </button>
  )
})
