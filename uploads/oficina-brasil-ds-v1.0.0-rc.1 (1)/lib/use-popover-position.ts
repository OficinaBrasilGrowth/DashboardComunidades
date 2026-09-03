'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

// Popovers/menus renderizados dentro do fluxo normal da página
// (position: absolute relativo ao gatilho) podem ficar atrás de um
// elemento fixed sem stacking context elevado (ex: uma sidebar que é
// `position: fixed` sem `z-index`) — nesse cenário, um z-index local ao
// conteúdo (mesmo que "alto") não garante nada, porque a comparação de
// empilhamento acontece dentro do contexto de empilhamento do
// ancestral, não no documento inteiro.
//
// Correção: calcula coordenadas reais de `position: fixed` a partir de
// `getBoundingClientRect()` do gatilho, pra ser usado com createPortal em
// document.body — assim o conteúdo compete por empilhamento no nível mais
// alto possível, onde um z-index simples de fato vence qualquer ancestral
// sem contexto próprio.
//
// Detecção de colisão: horizontal (clampa dentro da viewport, não só
// alterna esquerda/direita) e vertical (abre pra cima se não houver espaço
// suficiente abaixo). Recalcula em scroll e resize enquanto aberto, já que
// com position:fixed a posição do gatilho na tela muda com o scroll da
// página.

export interface PortalPosition {
  top: number
  left: number
  placement: 'top' | 'bottom'
}

const VIEWPORT_MARGIN = 8

export function usePopoverPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
  contentWidth: number,
  contentHeight = 0
): PortalPosition {
  const [position, setPosition] = useState<PortalPosition>({ top: 0, left: 0, placement: 'bottom' })

  const recalculate = useCallback(() => {
    const box = triggerRef.current?.getBoundingClientRect()
    if (!box) return

    const spaceBelow = window.innerHeight - box.bottom
    const spaceAbove = box.top
    const placement: 'top' | 'bottom' =
      spaceBelow >= contentHeight + VIEWPORT_MARGIN || spaceBelow >= spaceAbove ? 'bottom' : 'top'

    let left = box.left
    const wouldOverflowRight = left + contentWidth > window.innerWidth - VIEWPORT_MARGIN
    if (wouldOverflowRight) {
      left = box.right - contentWidth
    }
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - contentWidth - VIEWPORT_MARGIN))

    const top = placement === 'bottom' ? box.bottom + 6 : box.top - 6

    setPosition({ top, left, placement })
  }, [triggerRef, contentWidth, contentHeight])

  useEffect(() => {
    if (!open) return
    recalculate()
    window.addEventListener('scroll', recalculate, true)
    window.addEventListener('resize', recalculate)
    return () => {
      window.removeEventListener('scroll', recalculate, true)
      window.removeEventListener('resize', recalculate)
    }
  }, [open, recalculate])

  return position
}
