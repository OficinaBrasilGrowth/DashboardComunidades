'use client'

import { forwardRef, type InputHTMLAttributes, type ChangeEvent } from 'react'

// Borda vermelha + texto de ajuda vermelho abaixo em caso de erro, texto
// de ajuda cinza discreto quando válido.

// Prop opcional `mask="phone"`, em vez de tratar type="tel" como caso
// especial — nem todo campo rotulado como telefone necessariamente quer
// formatação brasileira forçada. Sem a máscara, um campo de telefone
// aceitaria texto livre sem nenhuma restrição a números ou formatação.
function formatPhoneBR(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
  /** 'phone' formata conforme digita em (11) 99999-9999 e bloqueia caracteres que não sejam dígitos. */
  mask?: 'phone'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, helperText, className, style, mask, onChange, inputMode, ...props },
  ref
) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (mask === 'phone') {
      e.target.value = formatPhoneBR(e.target.value)
    }
    onChange?.(e)
  }

  return (
    <div>
      <input
        ref={ref}
        inputMode={mask === 'phone' ? 'numeric' : inputMode}
        onChange={handleChange}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-background transition-shadow outline-none ${className ?? ''}`}
        style={{
          borderColor: error ? 'var(--destructive-text)' : 'var(--border)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = error
            ? 'var(--focus-ring-destructive)'
            : 'var(--focus-ring-primary)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none'
        }}
        aria-invalid={!!error}
        aria-describedby={error || helperText ? `${props.id}-message` : undefined}
        {...props}
      />
      {(error || helperText) && (
        <p
          id={`${props.id}-message`}
          className="text-xs mt-1.5 m-0"
          style={{ color: error ? 'var(--destructive-text)' : 'var(--muted-foreground)' }}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
})
