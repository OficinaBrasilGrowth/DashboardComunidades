'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { ChevronRightIcon } from './icons'

// Padrão WAI-ARIA "treeview" — o mais complexo dos padrões de teclado do
// design system: setas Cima/Baixo movem entre itens VISÍVEIS (não conta
// filhos colapsados), seta Direita expande um nó fechado (ou entra no
// primeiro filho se já aberto), Esquerda colapsa um nó aberto (ou volta
// pro pai se já fechado), Home/End vão pro primeiro/último item visível.
// role="tree" no container, role="treeitem" em cada nó, role="group"
// envolvendo os filhos — não uma lista aninhada genérica.

export interface TreeNode {
  key: string
  label: string
  children?: TreeNode[]
}

export interface TreeViewProps {
  data: TreeNode[]
  defaultExpandedKeys?: string[]
}

// Achata a árvore visível (respeitando o que está expandido) numa lista
// plana, na ordem de exibição — necessário pra Cima/Baixo saberem qual é
// o "próximo item visível", sem se importar se é irmão, filho ou tio.
function flattenVisible(nodes: TreeNode[], expanded: Set<string>, depth = 0): { node: TreeNode; depth: number }[] {
  return nodes.flatMap((node) => {
    const self = { node, depth }
    if (node.children && expanded.has(node.key)) {
      return [self, ...flattenVisible(node.children, expanded, depth + 1)]
    }
    return [self]
  })
}

export function TreeView({ data, defaultExpandedKeys = [] }: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpandedKeys))
  const [focusedKey, setFocusedKey] = useState<string>(data[0]?.key ?? '')
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const visible = flattenVisible(data, expanded)

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function focusItem(key: string) {
    setFocusedKey(key)
    itemRefs.current[key]?.focus()
  }

  function handleKeyDown(e: KeyboardEvent, node: TreeNode) {
    const index = visible.findIndex((v) => v.node.key === node.key)
    const hasChildren = !!node.children?.length
    const isExpanded = expanded.has(node.key)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = visible[index + 1]
      if (next) focusItem(next.node.key)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = visible[index - 1]
      if (prev) focusItem(prev.node.key)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (hasChildren && !isExpanded) {
        toggle(node.key)
      } else if (hasChildren && isExpanded) {
        const next = visible[index + 1]
        if (next) focusItem(next.node.key)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (hasChildren && isExpanded) {
        toggle(node.key)
      } else {
        // sobe pro pai: procura pra trás o item mais próximo com depth menor
        const currentDepth = visible[index].depth
        for (let i = index - 1; i >= 0; i--) {
          if (visible[i].depth < currentDepth) {
            focusItem(visible[i].node.key)
            break
          }
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusItem(visible[0].node.key)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusItem(visible[visible.length - 1].node.key)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (hasChildren) toggle(node.key)
    }
  }

  function renderNode(node: TreeNode, depth: number) {
    const hasChildren = !!node.children?.length
    const isExpanded = expanded.has(node.key)
    const isFocusable = node.key === focusedKey

    return (
      <div key={node.key} role="none">
        <div
          ref={(el) => { itemRefs.current[node.key] = el }}
          role="treeitem"
          tabIndex={isFocusable ? 0 : -1}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={false}
          onKeyDown={(e) => handleKeyDown(e, node)}
          onClick={() => {
            setFocusedKey(node.key)
            if (hasChildren) toggle(node.key)
          }}
          onFocus={() => setFocusedKey(node.key)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md cursor-pointer"
          style={{ paddingLeft: 8 + depth * 20, color: 'var(--foreground)' }}
        >
          {hasChildren ? (
            <ChevronRightIcon
              size={13}
              aria-hidden="true"
              className="shrink-0 transition-transform"
              style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', color: 'var(--muted-foreground)' }}
            />
          ) : (
            <span className="shrink-0" style={{ width: 13 }} aria-hidden="true" />
          )}
          {node.label}
        </div>
        {hasChildren && isExpanded && (
          <div role="group">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div role="tree" aria-label="Árvore de navegação">
      {data.map((node) => renderNode(node, 0))}
    </div>
  )
}
