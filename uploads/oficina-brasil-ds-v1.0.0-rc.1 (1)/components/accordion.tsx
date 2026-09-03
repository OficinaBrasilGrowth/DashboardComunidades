'use client'

import { useState } from 'react'
import { ChevronDownIcon } from './icons'

// Cabeçalho clicável com seta que gira, painel expande/colapsa.
// Estrutura semântica segue o padrão "accordion" das WAI-ARIA Authoring
// Practices: cada cabeçalho é um <button aria-expanded aria-controls>,
// cada painel tem role="region" aria-labelledby — não uma <div>
// genérica com onClick.
//
// `allowMultiple` decide se mais de uma seção pode ficar aberta ao mesmo
// tempo (padrão: não — abrir uma fecha as outras, como um Collapse comum).

export interface AccordionItem {
  key: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenKeys?: string[]
}

export function Accordion({ items, allowMultiple = false, defaultOpenKeys = [] }: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys)

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const isOpen = prev.includes(key)
      if (allowMultiple) {
        return isOpen ? prev.filter((k) => k !== key) : [...prev, key]
      }
      return isOpen ? [] : [key]
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      {items.map((item, i) => {
        const isOpen = openKeys.includes(item.key)
        const headerId = `accordion-header-${item.key}`
        const panelId = `accordion-panel-${item.key}`
        return (
          <div key={item.key} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
            <h3 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.key)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left"
                style={{ color: 'var(--foreground)' }}
              >
                {item.title}
                <ChevronDownIcon
                  size={16}
                  className="shrink-0 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--muted-foreground)' }}
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={headerId} className="px-4 pb-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
