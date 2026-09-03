'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../lib/use-click-outside'
import { usePopoverPosition } from '../lib/use-popover-position'
import { useEscapeKey } from '../lib/use-escape-key'
import { renderTrigger } from '../lib/as-child'

// Diferente do DropdownMenu (menu de ação com itens fixos) ou do
// InfoTooltip (dica com variantes de cor fixas): este é um popover
// genérico, aceita qualquer `children` como conteúdo — pra casos que não
// se encaixam nos componentes mais específicos que já existem. Reaproveita
// os mesmos hooks de posicionamento e click-outside já testados no
// DropdownMenu, não duplica a lógica.
//
// `asChild` — sem isso, QUALQUER trigger vira filho de um <button>
// próprio. Se o consumidor passar um <button> como trigger, isso gera
// <button><button>...</button></button>, interação aninhada inválida.
//
// Portal + posicionamento por coordenadas — o conteúdo renderizado no
// fluxo normal via position:absolute pode ficar atrás de um elemento
// fixed sem z-index próprio (ex: uma sidebar). Corrigido com
// createPortal pra document.body + coordenadas reais calculadas por
// lib/use-popover-position.ts, que resolve overflow horizontal E
// vertical. useClickOutside recebe duas refs (gatilho + conteúdo
// portado).

export interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  width?: number
  asChild?: boolean
}

export function Popover({ trigger, children, width = 240, asChild = false }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useClickOutside([triggerRef, contentRef], () => setOpen(false))
  const position = usePopoverPosition(triggerRef, open, width, 120)
  useEscapeKey(open, () => {
    setOpen(false)
    triggerRef.current?.focus()
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {renderTrigger({
        asChild,
        trigger,
        triggerRef,
        triggerProps: {
          onClick: () => setOpen((o) => !o),
          'aria-expanded': open,
          'aria-haspopup': 'dialog',
        },
      })}

      {open && mounted && createPortal(
        <div
          ref={contentRef}
          role="dialog"
          className="fixed z-50 rounded-lg border bg-popover p-4"
          style={{
            top: position.top,
            left: position.left,
            transform: position.placement === 'top' ? 'translateY(-100%)' : undefined,
            width,
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  )
}
