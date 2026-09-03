import type { ReactNode } from 'react'

export interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  iconColor?: 'blue' | 'green' | 'turquoise'
}

const iconBg: Record<NonNullable<KpiCardProps['iconColor']>, string> = {
  blue: 'var(--brand-azul)',
  green: 'var(--brand-verde)',
  turquoise: 'var(--brand-turquesa-surface)', // texto branco — ver globals.css
}
// Cor do texto dentro do selo de ícone — precisa respeitar contrast-rules.ts.
// Fundo verde nunca combina com ícone branco.
const iconFg: Record<NonNullable<KpiCardProps['iconColor']>, string> = {
  blue: 'var(--brand-azul-foreground)',
  green: 'var(--brand-verde-foreground)',
  turquoise: 'var(--brand-turquesa-surface-foreground)',
}

export function KpiCard({ title, value, subtitle, icon, iconColor = 'green' }: KpiCardProps) {
  return (
    <div
      className="rounded-lg bg-card p-5"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <p
        className="text-xs font-semibold uppercase m-0"
        style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}
      >
        {title}
      </p>
      <div className="flex items-center justify-between gap-3 mt-3">
        <p className="text-3xl font-bold m-0 tracking-tight" style={{ color: 'var(--card-foreground)' }}>{value}</p>
        {icon && (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg[iconColor], color: iconFg[iconColor], opacity: 0.92 }}
          >
            {icon}
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs mt-2 m-0" style={{ color: 'var(--muted-foreground)' }}>{subtitle}</p>}
    </div>
  )
}
