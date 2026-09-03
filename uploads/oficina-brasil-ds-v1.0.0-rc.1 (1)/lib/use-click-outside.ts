'use client'

import { useEffect, type RefObject } from 'react'

// Reaproveitado entre DropdownMenu e Popover — a mesma lógica de "fecha
// ao clicar fora" seria duplicada entre os dois componentes.
//
// Aceita uma ref só OU um array de refs — necessário pra portal: quando
// o conteúdo é renderizado via createPortal em document.body, ele fica
// numa subtree DOM diferente do gatilho. Uma única ref (só o container
// original) trataria um clique dentro do PRÓPRIO conteúdo portado como
// "fora", fechando o popover ao tentar interagir com ele. Checa contra
// todas as refs fornecidas — só fecha se o clique estiver fora de
// todas.

type RefOrRefs = RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[]

export function useClickOutside(refOrRefs: RefOrRefs, onOutsideClick: () => void) {
  useEffect(() => {
    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs]
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const clicouDentroDeAlguma = refs.some((ref) => ref.current && ref.current.contains(target))
      if (!clicouDentroDeAlguma) {
        onOutsideClick()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
