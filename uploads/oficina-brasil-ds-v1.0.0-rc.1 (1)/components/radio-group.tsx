'use client'

// Usa <input type="radio"> nativos compartilhando o mesmo `name` — isso já
// dá navegação por seta (↑↓←→) entre as opções do grupo de graça, direto do
// navegador, seguindo o padrão WAI-ARIA "radiogroup" sem precisar
// reimplementar nada em JS.

export interface RadioOption {
  label: string
  value: string
}

export interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function RadioGroup({ name, options, value, onChange, disabled }: RadioGroupProps) {
  return (
    <div role="radiogroup" className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const checked = value === opt.value
        return (
          <label key={opt.value} htmlFor={id} className="inline-flex items-center gap-2.5 cursor-pointer select-none w-fit">
            <span className="relative inline-flex items-center justify-center" style={{ width: 20, height: 20 }}>
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(opt.value)}
                className="peer appearance-none w-5 h-5 rounded-full border-2 m-0"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
              />
              <span
                className="pointer-events-none absolute rounded-full opacity-0 peer-checked:opacity-100 peer-disabled:opacity-40"
                style={{ width: 10, height: 10, backgroundColor: 'var(--primary)' }}
              />
            </span>
            <span className="text-sm" style={{ color: 'var(--foreground)' }}>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
