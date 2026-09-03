'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../lib/use-click-outside'
import { usePopoverPosition } from '../lib/use-popover-position'
import { renderTrigger } from '../lib/as-child'

// Gatilho + menu flutuante, fecha ao selecionar/clicar fora/Escape. O
// comportamento de teclado segue o padrão "menu button" das WAI-ARIA:
// ArrowDown/Up movem um item destacado, Enter/Space ativa ele, Escape
// fecha e devolve o foco ao gatilho.
//
// `asChild` — sem isso, um <button> passado como trigger vira
// <button><button>...</button></button>, interação aninhada inválida.
//
// Portal + posicionamento por coordenadas — o menu renderizado dentro
// do fluxo normal via position:absolute pode ficar atrás de um
// elemento fixed sem z-index próprio (ex: uma sidebar), por causa de
// como contextos de empilhamento se comparam. Corrigido com
// createPortal pra document.body + coordenadas reais calculadas por
// lib/use-popover-position.ts, que resolve overflow horizontal E
// vertical. useClickOutside recebe duas refs (gatilho + conteúdo
// portado), necessário porque as duas ficam em subtrees DOM diferentes
// depois do portal.

export interface DropdownMenuItem {
  key: string
  label: string
  onSelect: () => void
  destructive?: boolean
}

export interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  asChild?: boolean
}

const MENU_WIDTH = 180
const MENU_HEIGHT_ESTIMATE = 40

export function DropdownMenu({ trigger, items, asChild = false }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  useClickOutside([triggerRef, menuRef], () => setOpen(false))
  const position = usePopoverPosition(triggerRef, open, MENU_WIDTH, items.length * MENU_HEIGHT_ESTIMATE)

  useEffect(() => {
    setMounted(true)
  }, [])

  function openMenu() {
    setOpen(true)
    setHighlighted(0)
    setTimeout(() => itemRefs.current[0]?.focus(), 0)
  }

  function close(returnFocus = true) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (highlighted + 1) % items.length
      setHighlighted(next)
      itemRefs.current[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (highlighted - 1 + items.length) % items.length
      setHighlighted(prev)
      itemRefs.current[prev]?.focus()
    } else if (e.key === 'Tab') {
      // Menus não deveriam prender o Tab como um modal — só fecha e deixa o foco seguir naturalmente.
      close(false)
    }
  }

  return (
    <>
      {renderTrigger({
        asChild,
        trigger,
        triggerRef,
        triggerProps: {
          onClick: () => (open ? close() : openMenu()),
          'aria-haspopup': 'menu',
          'aria-expanded': open,
        },
      })}

      {open && mounted && createPortal(
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className="fixed z-50 rounded-lg border bg-popover overflow-hidden py-1"
          style={{
            top: position.top,
            left: position.left,
            transform: position.placement === 'top' ? 'translateY(-100%)' : undefined,
            borderColor: 'var(--border)',
            minWidth: MENU_WIDTH,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {items.map((item, i) => (
            <button
              key={item.key}
              ref={(el) => { itemRefs.current[i] = el }}
              role="menuitem"
              tabIndex={-1}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => {
                item.onSelect()
                close()
              }}
              className="w-full text-left px-3.5 py-2 text-sm"
              style={{
                // Usa var(--popover-foreground), não uma cor fixa — um
                // hex fixo como #00134E coincide com o valor certo no
                // light mode mas nunca se adaptaria ao dark mode, onde o
                // texto correto é diferente. Texto escuro fixo sobre um
                // menu com fundo escuro no dark mode seria ilegível.
                color: item.destructive ? 'var(--destructive-text)' : 'var(--popover-foreground)',
                backgroundColor: i === highlighted ? 'var(--muted)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
