'use client'

import { useState, useRef, type ReactNode } from 'react'

// Indicador de sublinhado deslizando pra aba ativa, painel de conteúdo
// abaixo. O comportamento de teclado segue o padrão "tabs" das WAI-ARIA
// Authoring Practices: as setas Esquerda/Direita movem o foco E ativam
// a aba (ativação automática), Home/End pulam pra primeira/última aba.
// Construído com suporte a teclado desde o início, não encaixado depois
// — lacunas de teclado adicionadas depois de um componente já pronto
// são fáceis de passar despercebidas.

export interface TabItem {
  key: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  defaultKey?: string
}

export function Tabs({ items, defaultKey }: TabsProps) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function focusAndActivate(key: string) {
    setActive(key)
    tabRefs.current[key]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = items[(index + 1) % items.length]
      focusAndActivate(next.key)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = items[(index - 1 + items.length) % items.length]
      focusAndActivate(prev.key)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusAndActivate(items[0].key)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusAndActivate(items[items.length - 1].key)
    }
  }

  const activeItem = items.find((i) => i.key === active)

  return (
    <div>
      <div role="tablist" aria-label="Tabs" className="flex gap-1 relative" style={{ borderBottom: '1px solid var(--border)' }}>
        {items.map((item, index) => {
          const isActive = item.key === active
          return (
            <button
              key={item.key}
              ref={(el) => { tabRefs.current[item.key] = el }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${item.key}`}
              id={`tab-${item.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(item.key)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="px-4 py-2.5 text-sm font-medium relative transition-colors"
              style={{
                color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              {item.label}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-px"
                  style={{ height: 2, backgroundColor: 'var(--primary)', borderRadius: 2 }}
                />
              )}
            </button>
          )
        })}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`panel-${activeItem.key}`}
          aria-labelledby={`tab-${activeItem.key}`}
          tabIndex={0}
          className="pt-4"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  )
}
