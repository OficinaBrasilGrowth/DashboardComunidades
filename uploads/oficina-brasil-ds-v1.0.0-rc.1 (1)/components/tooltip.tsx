'use client'

import { useId, useState, type ReactNode } from 'react'
import { useEscapeKey } from '../lib/use-escape-key'

// Padrão WAI-ARIA "tooltip" — ativado por hover E foco de teclado (foco é
// fácil de esquecer, mas essencial: quem navega só com teclado nunca passa
// o mouse por cima de nada). Diferente do InfoTooltip (que tem um "i" fixo
// como gatilho e variantes de cor pra usar sobre fundos específicos), esse
// aceita qualquer elemento como gatilho — pra dar contexto extra em cima de
// um ícone, uma palavra truncada, etc.
//
// role="tooltip" + aria-describedby (não aria-labelledby) — o texto do
// tooltip complementa o gatilho, não substitui o nome acessível dele.
//
// Escape fecha o tooltip — sem isso, quem abre por foco de teclado não
// teria como dispensar sem tirar o foco do gatilho (só fechando no
// blur/mouseleave).

export interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()

  useEscapeKey(visible, () => setVisible(false))

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={visible ? id : undefined}>{children}</span>
      {visible && (
        <span
          role="tooltip"
          id={id}
          className="absolute z-10 left-1/2 bottom-full mb-1.5 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs"
          style={{ backgroundColor: 'var(--brand-azul-escuro)', color: 'var(--brand-azul-escuro-foreground)' }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
