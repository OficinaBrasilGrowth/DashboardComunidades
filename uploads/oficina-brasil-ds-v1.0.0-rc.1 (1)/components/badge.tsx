import type { ReactNode } from 'react'

// Variantes semânticas em vez de expor cores de marca cruas — quem usa o
// Badge não precisa saber qual combinação de fundo/texto é aprovada
// conforme contrast-rules.ts, o componente já resolve isso por dentro.
// 'success' usa verde + azulEscuro (nunca branco sobre verde — regra
// inegociável do guia). 'warning' usa laranja escurecido + texto branco
// (5.45:1), unificado com o padrão de texto branco sobre fundo saturado
// que as outras variantes já seguem.

export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, { bg: string; fg: string }> = {
  neutral: { bg: 'var(--muted)', fg: 'var(--muted-foreground)' },
  info: { bg: 'var(--info-surface)', fg: 'var(--info-surface-foreground)' },
  success: { bg: 'var(--success-surface)', fg: 'var(--success-surface-foreground)' }, // nunca branco sobre turquesa — contrast-rules.ts
  warning: { bg: 'var(--warning-surface)', fg: 'var(--warning-surface-foreground)' }, // laranja escurecido + branco, 5.45:1 — unificado com as demais variantes
  error: { bg: 'var(--destructive-surface)', fg: 'var(--destructive-surface-foreground)' },
}

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const { bg, fg } = variantStyles[variant]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </span>
  )
}
