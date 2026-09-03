'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { normalizeText } from '../lib/normalize-text'
import { useFocusTrap } from '../lib/use-focus-trap'
import { useEscapeKey } from '../lib/use-escape-key'

// Padrão "command palette" (Cmd+K / Ctrl+K) popularizado por ferramentas
// como VS Code e Linear. Reaproveita 3 peças já testadas do resto do
// design system em vez de reconstruir do zero: useFocusTrap
// (Modal/AlertDialog), useEscapeKey (Popover/MultiSelect), normalizeText
// (BrandSelect/MultiSelect — busca sem acento).
//
// O listener do atalho global (Cmd+K) precisa existir mesmo com a paleta
// FECHADA — diferente de todo outro componente do sistema, que só ouve
// teclado enquanto está aberto. `preventDefault()` é necessário porque
// Ctrl+K é um atalho nativo do navegador em alguns casos (foca a barra de
// busca) — sem isso, o atalho da paleta brigaria com o do navegador.
//
// Portal pra document.body + useId — mesmo motivo do Modal/AlertDialog:
// um id fixo tipo "command-palette-list" colidiria com duas instâncias
// montadas ao mesmo tempo, e renderizar no lugar da árvore arrisca
// ficar clipado por overflow/stacking context de um ancestral numa
// aplicação real. `mounted` evita chamar `document.body` durante SSR.

export interface CommandPaletteItem {
  key: string
  label: string
  onSelect: () => void
  shortcut?: string
}

export interface CommandPaletteProps {
  commands: CommandPaletteItem[]
}

export function CommandPalette({ commands }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const filtered = useMemo(() => {
    if (!query) return commands
    const q = normalizeText(query)
    return commands.filter((cmd) => normalizeText(cmd.label).includes(q))
  }, [commands, query])

  function close() {
    setOpen(false)
    setQuery('')
  }

  useFocusTrap(dialogRef, open, close, '[data-command-palette-input]')
  useEscapeKey(open, close)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleGlobalShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', handleGlobalShortcut)
    return () => document.removeEventListener('keydown', handleGlobalShortcut)
  }, [])

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  function runCommand(cmd: CommandPaletteItem) {
    close()
    cmd.onSelect()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filtered[highlighted]
      if (cmd) runCommand(cmd)
    }
  }

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      style={{ backgroundColor: 'var(--shadow-overlay-backdrop)' }}
      role="presentation"
      onClick={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-lg overflow-hidden mx-4"
        style={{ backgroundColor: 'var(--popover)', boxShadow: 'var(--shadow-lg)' }}
      >
        <input
          data-command-palette-input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite um comando..."
          aria-label="Buscar comando"
          role="combobox"
          aria-expanded={true}
          aria-controls={listId}
          aria-activedescendant={filtered.length > 0 ? `${listId}-option-${highlighted}` : undefined}
          autoComplete="off"
          className="w-full px-4 py-3.5 text-sm border-b outline-none bg-transparent"
          style={{ borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
        />
        <ul id={listId} role="listbox" aria-label="Comandos" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <li role="presentation" className="px-4 py-3 text-sm text-muted-foreground">Nenhum comando encontrado</li>
          )}
          {filtered.map((cmd, i) => (
            <li key={cmd.key} role="presentation">
              <button
                type="button"
                id={`${listId}-option-${i}`}
                role="option"
                aria-selected={i === highlighted}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => runCommand(cmd)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left"
                style={{
                  backgroundColor: i === highlighted ? 'var(--muted)' : 'transparent',
                  color: 'var(--popover-foreground)',
                }}
              >
                <span>{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{cmd.shortcut}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  )
}
