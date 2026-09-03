'use client'

// Usa <input type="range"> nativo, não um role="slider" simulado — dá
// navegação por teclado de graça (setas Esquerda/Direita mudam o valor,
// Home/End vão pro mínimo/máximo), mesmo princípio já usado no
// Checkbox/RadioGroup. O estilo do thumb precisa de CSS global (ver
// globals.css, classe .ds-slider) porque os pseudo-elementos de thumb de
// range exigem prefixo de fornecedor — não dá pra fazer só com Tailwind.

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, disabled }: SliderProps) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>{label}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{value}</span>
        </div>
      )}
      <input
        type="range"
        className="ds-slider w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuetext={String(value)}
      />
    </div>
  )
}
