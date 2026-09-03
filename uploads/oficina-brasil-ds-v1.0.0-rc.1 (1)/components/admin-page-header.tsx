import type { ReactNode } from 'react'

// O guia de marca da Oficina Brasil define 5 cores oficiais — este
// componente sai com exatamente 5 variantes (todas as combinações
// aprovadas conforme contrast-rules.ts). Adicione mais só se o design
// fornecer cores de marca aprovadas adicionais.
export type AdminPageHeaderColor = 'azul' | 'azulEscuro' | 'verde' | 'turquesa' | 'azulClaro'

export interface AdminPageHeaderProps {
  color: AdminPageHeaderColor
  icon?: ReactNode
  title: string
  subtitle?: string
  actions?: ReactNode
}

const colorMap: Record<AdminPageHeaderColor, { bg: string; fg: string }> = {
  azul: { bg: 'var(--brand-azul)', fg: 'var(--brand-azul-foreground)' },
  azulEscuro: { bg: 'var(--brand-azul-escuro)', fg: 'var(--brand-azul-escuro-foreground)' },
  verde: { bg: 'var(--brand-verde)', fg: 'var(--brand-verde-foreground)' }, // nunca texto branco sobre verde — contrast-rules.ts
  turquesa: { bg: 'var(--brand-turquesa-surface)', fg: 'var(--brand-turquesa-surface-foreground)' }, // texto branco — ver globals.css
  azulClaro: { bg: 'var(--brand-azul-claro)', fg: 'var(--brand-azul-claro-foreground)' },
}

export function AdminPageHeader({ color, icon, title, subtitle, actions }: AdminPageHeaderProps) {
  const { bg, fg } = colorMap[color]
  return (
    <div
      className="rounded-lg px-6 py-5 flex items-center justify-between gap-4"
      style={{ backgroundColor: bg, color: fg, boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="flex items-center gap-3.5">
        {icon && <span className="flex items-center justify-center">{icon}</span>}
        <div>
          <p className="text-xl font-bold m-0 tracking-tight">{title}</p>
          {subtitle && (
            // Cor sólida direto, nunca opacity, no texto de subtítulo —
            // opacity reduz o contraste EFETIVO do texto renderizado,
            // não só o declarado, e depende do fundo por trás. Pode
            // falhar silenciosamente pra variantes específicas de cor
            // sem as outras acusarem nada.
            <p className="text-sm m-0 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}
