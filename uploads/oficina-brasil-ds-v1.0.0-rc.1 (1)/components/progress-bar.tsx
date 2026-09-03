// role="progressbar" nativo do ARIA, com aria-valuenow/min/max — leitor de
// tela anuncia o progresso sem precisar de nenhum texto extra escondido.
//
// Mesmo achado do ProgressRing: sem `label`, ficaria sem nome
// acessível. A auditoria automatizada não pegaria isso se todo exemplo
// de teste passasse `label` — o bug só aparece pra quem usa sem essa
// prop. Mesmo fallback: gera um aria-label padrão a partir do valor
// quando `label` não é passado.

export interface ProgressBarProps {
  value: number // 0-100
  label?: string
  color?: string
}

export function ProgressBar({ value, label, color = 'var(--primary)' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const accessibleLabel = label ?? `${clamped}% concluído`
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>{label}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        className="w-full rounded-full overflow-hidden"
        style={{ height: 8, backgroundColor: 'var(--muted)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
