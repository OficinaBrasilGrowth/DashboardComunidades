import { ChevronRightIcon } from './icons'

// "positiveDirection" existe porque nem toda alta é uma coisa boa — receita
// subindo é bom (up=success), mas custo ou taxa de cancelamento subindo é
// ruim (up=error). O componente não assume isso sozinho, quem usa decide.
//
// Cor "positiva" é turquesa, não verde: o guia reserva verde pro destaque
// do wordmark ("uso comedido"), e esse indicador vai aparecer com bastante
// frequência em qualquer dashboard — turquesa já tem o papel de "acento
// secundário" nos tokens (lib/tokens.ts) e evita saturar o verde fora do
// contexto que o guia pretendia pra ele.
//
// A turquesa usada como cor "positiva" (#008073, versão escurecida do
// token original) mede 4.84:1 de contraste sobre fundo branco/card —
// escurecida o suficiente da turquesa base (#00B7A4, que mediria só
// 2.53:1) pra ler como texto pequeno, mantendo a mesma tonalidade
// perceptualmente.
//
// As cores usam var(--stat-positive) e var(--destructive-text), não hex
// fixo — esses tokens têm valores próprios e corretos pro dark mode em
// globals.css.

export interface StatComparisonProps {
  title: string
  value: string | number
  previousLabel?: string
  changePercent: number
  positiveDirection?: 'up' | 'down'
}

export function StatComparison({
  title,
  value,
  previousLabel = 'vs período anterior',
  changePercent,
  positiveDirection = 'up',
}: StatComparisonProps) {
  const isUp = changePercent >= 0
  const isPositive = positiveDirection === 'up' ? isUp : !isUp
  const color = changePercent === 0 ? 'var(--muted-foreground)' : isPositive ? 'var(--stat-positive)' : 'var(--destructive-text)'

  return (
    <div className="rounded-lg bg-card p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <p className="text-xs font-semibold uppercase m-0" style={{ color: 'var(--muted-foreground)', letterSpacing: '0.06em' }}>
        {title}
      </p>
      <p className="text-3xl font-bold m-0 mt-3 tracking-tight" style={{ color: 'var(--card-foreground)' }}>
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <span
          className="inline-flex items-center gap-0.5 text-xs font-semibold"
          style={{ color }}
        >
          <ChevronRightIcon
            size={12}
            style={{ transform: isUp ? 'rotate(-90deg)' : 'rotate(90deg)' }}
          />
          {Math.abs(changePercent)}%
        </span>
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{previousLabel}</span>
      </div>
    </div>
  )
}
