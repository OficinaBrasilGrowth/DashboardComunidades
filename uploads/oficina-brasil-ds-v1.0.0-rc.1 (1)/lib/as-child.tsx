'use client'

import { cloneElement, isValidElement, type ReactElement, type ReactNode, type Ref } from 'react'

// Padrão `asChild` — Popover e DropdownMenu recebem qualquer `ReactNode`
// como trigger e colocam esse conteúdo dentro de um <button> PRÓPRIO. Se
// alguém passar um <button> como trigger, isso gera
// <button><button>...</button></button> — interação aninhada inválida
// (o navegador na prática "quebra" o botão externo, cliques ficam
// imprevisíveis).
//
// Com `asChild`, em vez de envolver o trigger num elemento novo, o
// componente CLONA o único elemento filho recebido e funde as próprias
// props nele (onClick, aria-expanded, aria-haspopup, ref) — se o
// consumidor já passou um <button>, as props vão direto nele, sem
// aninhar nada. Sem `asChild` (padrão), continua envolvendo num
// <button> próprio — comportamento existente preservado.
//
// Limitação documentada, não escondida: se o elemento filho já tiver a
// própria `ref`, essa ref é substituída pela nossa (não mesclada) — uma
// mesclagen robusta de múltiplas refs existentes exigiria ler
// `element.ref` de um jeito que não é garantido entre versões do React.
// Na prática, o caso de uso comum de `asChild` (passar um <Button> ou
// <a> sem precisar de ref própria ali) não esbarra nisso.

export interface RenderTriggerOptions {
  asChild?: boolean
  trigger: ReactNode
  triggerRef: Ref<HTMLElement>
  triggerProps: Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void }
}

export function renderTrigger({ asChild, trigger, triggerRef, triggerProps }: RenderTriggerOptions): ReactNode {
  if (asChild && isValidElement(trigger)) {
    const child = trigger as ReactElement<Record<string, unknown> & { onClick?: (e: React.MouseEvent) => void }>
    return cloneElement(child, {
      ...triggerProps,
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e)
        triggerProps.onClick?.(e)
      },
    })
  }

  return (
    <button type="button" ref={triggerRef as Ref<HTMLButtonElement>} {...triggerProps}>
      {trigger}
    </button>
  )
}
