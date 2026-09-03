'use client'

import { forwardRef, useEffect, useRef, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { CheckIcon } from './icons'

// Checkbox nativo (não role="checkbox" simulado) — mantém toda a
// acessibilidade padrão do navegador de graça (Space pra marcar, leitor de
// tela anuncia "marcado"/"desmarcado" sem nenhum ARIA manual). O quadrado
// visual é desenhado por cima via appearance-none + CSS, não uma
// reconstrução com <div role="checkbox">.
//
// Suporte a indeterminate: o HTML não tem esse estado como atributo, só
// como propriedade do DOM — por isso precisa de um ref + useEffect em vez
// de só uma prop.
//
// Radius fixo em 6px, não a classe rounded-md: descoberto durante teste
// real que rounded-md deste projeto mapeia pra calc(var(--radius) - 2px)
// = 10px (já que --radius = 12px) — em uma caixa de 20px isso é exatamente
// 50%, virando um círculo perfeito em vez de um quadrado arredondado.
// O token de radius do design system funciona bem pra cards/botões, mas é
// desproporcional pra um elemento tão pequeno — um valor fixo é a escolha
// certa aqui, não um erro de não usar o token.
//
// onChange usa (checked: boolean) => void, não o (e: ChangeEvent) => void
// do evento nativo — alinhado com BrandSelect/RadioGroup/Switch/DatePicker,
// que também usam valor direto em vez do evento cru.

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  indeterminate?: boolean
  error?: string
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate, error, className, id, onChange, ...props },
  forwardedRef
) {
  const internalRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate
    }
  }, [indeterminate])

  function setRefs(el: HTMLInputElement | null) {
    internalRef.current = el
    if (typeof forwardedRef === 'function') forwardedRef(el)
    else if (forwardedRef) forwardedRef.current = el
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(e.target.checked)
  }

  return (
    <div>
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <span className="relative inline-flex items-center justify-center" style={{ width: 20, height: 20 }}>
          <input
            ref={setRefs}
            type="checkbox"
            id={id}
            onChange={handleChange}
            className={`peer appearance-none w-5 h-5 border-2 m-0 transition-colors ${className ?? ''}`}
            style={{
              borderColor: error ? 'var(--destructive-text)' : 'var(--border)',
              backgroundColor: 'var(--background)',
              borderRadius: '6px',
            }}
            {...props}
          />
          {/* Marca de check/indeterminado desenhada por cima — o :checked
              nativo controla a visibilidade via peer-checked, sem estado
              React duplicado. */}
          <span
            className="pointer-events-none absolute inset-0 items-center justify-center opacity-0 peer-checked:opacity-100 peer-[:indeterminate]:opacity-100 peer-disabled:opacity-40"
            style={{ display: 'flex', backgroundColor: 'var(--primary)', borderRadius: '6px' }}
          >
            {indeterminate ? (
              <span style={{ width: 10, height: 2, backgroundColor: 'var(--primary-foreground)', borderRadius: 1 }} />
            ) : (
              <CheckIcon size={12} style={{ color: 'var(--primary-foreground)' }} />
            )}
          </span>
        </span>
        {label && <span className="text-sm" style={{ color: 'var(--foreground)' }}>{label}</span>}
      </label>
      {error && (
        <p className="text-xs mt-1.5 ml-7 m-0" style={{ color: 'var(--destructive-text)' }}>{error}</p>
      )}
    </div>
  )
})
