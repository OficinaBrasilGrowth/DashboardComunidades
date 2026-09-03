'use client'

// Trilho + círculo deslizante. Não existe um <input> nativo pra
// "switch" (diferente do Checkbox/RadioGroup, que reaproveitam
// input[type=checkbox/radio] de propósito) — por isso isso segue o padrão
// WAI-ARIA "switch" com um <button role="switch" aria-checked>, que já dá
// Space/Enter pra alternar de graça via o comportamento nativo de button.

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
}

export function Switch({ checked, onChange, disabled, label, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative rounded-full transition-colors shrink-0"
        style={{
          width: 40,
          height: 22,
          backgroundColor: checked ? 'var(--primary)' : 'var(--muted)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          className="absolute rounded-full transition-transform"
          style={{
            width: 16,
            height: 16,
            top: 3,
            left: 3,
            // #FFFFFF fixo de propósito, NÃO var(--primary-foreground) —
            // --primary-foreground vira azulEscuro (#00134E) no dark
            // mode, já que --primary vira verde nesse tema. Mapear a
            // bolinha pra --primary-foreground faria ela quase
            // desaparecer contra o fundo escuro da página no dark mode.
            // A bolinha não é "o ícone sobre a superfície primary" (esse
            // conceito já está certo no Checkbox/MultiSelect) — é um
            // elemento decorativo neutro que precisa ficar visível
            // contra qualquer cor de trilho, em qualquer tema.
            backgroundColor: '#FFFFFF',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            boxShadow: 'var(--shadow-xs)',
          }}
        />
      </button>
      {label && <span className="text-sm" style={{ color: 'var(--foreground)' }}>{label}</span>}
    </label>
  )
}
