// Anel de progresso via SVG (stroke-dasharray/stroke-dashoffset) — mesmo
// truque padrão de qualquer indicador circular, sem biblioteca externa.
// Mesmo role="progressbar" do ProgressBar, pra acessibilidade consistente
// entre os dois.
//
// Sem `label`, o role="progressbar" ficaria sem nenhum nome acessível
// — violação real de acessibilidade (aria-progressbar-name), não só
// teórica. Gera um aria-label padrão a partir do próprio valor quando
// `label` não é passado, em vez de deixar vazio.

export interface ProgressRingProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
}

export function ProgressRing({ value, size = 64, strokeWidth = 6, color = 'var(--primary)', label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  const accessibleLabel = label ?? `${clamped}% concluído`

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={accessibleLabel}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <span
        className="absolute text-sm font-semibold"
        style={{ color: 'var(--foreground)' }}
        aria-hidden="true"
      >
        {clamped}%
      </span>
    </div>
  )
}
