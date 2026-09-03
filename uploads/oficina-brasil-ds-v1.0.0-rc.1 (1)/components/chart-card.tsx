import type { ReactNode } from 'react'

export interface ChartCardProps {
  title: string
  children: ReactNode
}

// Moldura padrão pra qualquer gráfico (Chart.js, Recharts, etc.) — o card só
// padroniza borda, radius e cabeçalho; o gráfico em si fica com o que quer
// que o consumidor renderize dentro.
export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div
      className="rounded-lg bg-card p-5"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      <p className="text-sm font-semibold m-0 mb-4" style={{ color: 'var(--card-foreground)' }}>{title}</p>
      {children}
    </div>
  )
}
