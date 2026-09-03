'use client'

import { useEffect } from 'react'

// Um elemento clicável dentro de um popover recebe foco ao ser clicado,
// e um onKeyDown de Escape anexado só no gatilho ou só num campo de
// busca nunca recebe o evento nesse caso, porque o foco está em outro
// lugar. Um listener no document, independente de onde o foco estiver,
// evita esse padrão de bug se repetir.

export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
