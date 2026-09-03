'use client'

import { useEffect, useRef, type RefObject } from 'react'

// A lógica de focus trap (Tab/Shift+Tab ciclando dentro do diálogo, foco
// movendo pra dentro ao abrir, restaurado ao fechar) é idêntica entre
// Modal e AlertDialog — compartilhada aqui num hook só, testada nos dois
// componentes, não duplicada.
//
// `initialFocusSelector` existe porque o AlertDialog precisa focar o botão
// de Cancelar por padrão (ação seguros), não "o primeiro elemento focável"
// genérico como o Modal fazia — evita que alguém aperte Enter sem querer
// logo ao abrir e confirme a ação destrutiva sem querer.

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  initialFocusSelector?: string
) {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const container = containerRef.current
    const initial = initialFocusSelector
      ? container?.querySelector<HTMLElement>(initialFocusSelector)
      : container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)?.[0]
    initial?.focus()

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !container) return

      const nodes = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      previouslyFocused.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose])
}
