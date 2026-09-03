'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../lib/use-focus-trap'

// Card centralizado sobre um overlay escuro, botão de fechar no canto
// superior direito, ESC pra descartar, clique no overlay pra descartar.
//
// Gerenciamento de foco: prende Tab/Shift+Tab dentro dos elementos
// focáveis do diálogo, move o foco pra dentro do diálogo ao abrir, e
// restaura o foco no elemento focado anteriormente ao fechar — sem
// isso, o Tab poderia escapar pra página atrás do overlay.
//
// A lógica de focus trap foi extraída pro hook useFocusTrap (lib/) quando
// o AlertDialog foi construído — reaproveitada aqui, não duplicada.
//
// Portal pra document.body + useId — um id fixo tipo "modal-title"
// colidiria se dois Modals existissem simultaneamente no DOM (mesmo que
// só um esteja aberto — React pode manter os dois montados dependendo
// de como o consumidor usa o componente), e renderizar no lugar da
// árvore (não via portal) pode fazer o overlay ficar clipado por um
// `overflow: hidden` ou stacking context de um ancestral qualquer numa
// aplicação real. `mounted` existe porque `createPortal` chama
// `document.body`, que não existe durante a renderização no servidor
// (Next.js SSR) — sem essa guarda, um consumidor que abrisse o Modal
// com `open` já `true` na primeira renderização quebraria o build/SSR.

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [mounted, setMounted] = useState(false)
  useFocusTrap(dialogRef, open, onClose)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'var(--shadow-overlay-backdrop)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-7 max-w-md w-full mx-4 relative"
        style={{ backgroundColor: 'var(--popover)', boxShadow: 'var(--shadow-lg)' }}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center text-base transition-colors hover:bg-muted"
          style={{ color: 'var(--muted-foreground)' }}
        >
          ×
        </button>
        <p id={titleId} className="text-lg font-bold m-0 mb-2.5 pr-8" style={{ color: 'var(--popover-foreground)' }}>
          {title}
        </p>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
