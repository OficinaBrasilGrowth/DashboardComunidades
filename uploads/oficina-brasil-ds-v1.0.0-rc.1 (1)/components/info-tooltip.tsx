'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePopoverPosition } from '../lib/use-popover-position'
import { useEscapeKey } from '../lib/use-escape-key'

export type InfoTooltipVariant = 'solid' | 'ghost' | 'on-dark'

export interface InfoTooltipProps {
  message: string
  variant?: InfoTooltipVariant
}

const variantStyles: Record<InfoTooltipVariant, { trigger: React.CSSProperties; bubble: React.CSSProperties }> = {
  solid: {
    trigger: { backgroundColor: 'var(--brand-azul)', color: 'var(--brand-azul-foreground)' },
    bubble: { backgroundColor: 'var(--brand-azul-escuro)', color: 'var(--brand-azul-escuro-foreground)' },
  },
  ghost: {
    trigger: { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' },
    bubble: { backgroundColor: 'var(--brand-azul-escuro)', color: 'var(--brand-azul-escuro-foreground)' },
  },
  'on-dark': {
    // Combinação aprovada: fundo azulEscuro precisa de texto branco/verde/azulClaro — nunca branco puro sem checar contrast-rules.ts
    trigger: { backgroundColor: 'var(--brand-azul-escuro)', color: 'var(--brand-azul-escuro-foreground)' },
    bubble: { backgroundColor: 'var(--brand-branco)', color: 'var(--brand-branco-foreground)' },
  },
}

const BUBBLE_WIDTH_ESTIMATE = 220

// Portal + posicionamento por coordenadas — o balão renderizado no
// fluxo normal via position:absolute pode ficar atrás de um elemento
// fixed sem z-index próprio (ex: uma sidebar). Corrigido com
// createPortal pra document.body + coordenadas reais, resolvendo
// overflow horizontal E vertical automaticamente — substitui a prop
// `align` manual (left/center/right) que existia antes, já que a
// detecção de colisão agora decide isso sozinha.
//
// Escape fecha o balão, usando o mesmo hook useEscapeKey já testado no
// Popover/MultiSelect, sem tirar o foco do gatilho (diferente do
// Popover, que devolve foco ao fechar — aqui o foco já está no
// gatilho, porque é assim que o tooltip abre por teclado).

export function InfoTooltip({ message, variant = 'solid' }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const styles = variantStyles[variant]
  const position = usePopoverPosition(triggerRef, open, BUBBLE_WIDTH_ESTIMATE, 40)

  useEscapeKey(open, () => setOpen(false))

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Mais informações"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="w-5 h-5 rounded-full inline-flex items-center justify-center text-xs font-bold transition-shadow"
        style={{ ...styles.trigger, boxShadow: open ? 'var(--focus-ring-primary)' : 'none' }}
      >
        i
      </button>
      {open && mounted && createPortal(
        <span
          role="tooltip"
          className="fixed z-50 text-xs px-3 py-2 rounded-lg whitespace-nowrap"
          style={{
            top: position.top,
            left: position.left,
            transform: position.placement === 'top' ? 'translateY(-100%)' : undefined,
            ...styles.bubble,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {message}
        </span>,
        document.body
      )}
    </>
  )
}
