'use client'

import { useState, useMemo, useRef, useEffect, useId } from 'react'
import { ChevronDownIcon } from './icons'
import { normalizeText } from '../lib/normalize-text'
import { useClickOutside } from '../lib/use-click-outside'
import { useEscapeKey } from '../lib/use-escape-key'

// Campo de busca no topo, lista filtrada abaixo, botão de limpar aparece
// só quando um valor está definido, opção ativa destacada.
//
// Largura: w-full, não um valor fixo. Uma largura fixa ignoraria
// qualquer wrapper mais estreito onde o componente fosse colocado (ex:
// dentro do FilterBar, um wrapper de 200px), fazendo o Select vazar por
// cima do controle de filtro vizinho. Segue o mesmo padrão do
// Input/Textarea — quem usa controla a largura via wrapper, o
// componente sempre preenche 100% do espaço disponível.
//
// normalizeText() e useClickOutside vêm de lib/ — reaproveitados do
// MultiSelect, não duplicados.

export interface BrandSelectOption {
  label: string
  value: string
}

export interface BrandSelectProps {
  options: BrandSelectOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
}

export function BrandSelect({ options, value, onChange, placeholder }: BrandSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const optionId = (i: number) => `${listboxId}-option-${i}`

  const filtered = useMemo(() => {
    if (!query) return options
    const q = normalizeText(query)
    return options.filter((opt) => normalizeText(opt.label).includes(q))
  }, [options, query])

  const selectedLabel = options.find((opt) => opt.value === value)?.label

  // Centraliza todos os caminhos de fechamento sem aplicar seleção
  // (clique fora, Esc, clique no próprio gatilho) numa função só, pra
  // garantir que a busca seja sempre limpa de forma consistente —
  // useClickOutside e useEscapeKey chamam a mesma close(). useEscapeKey
  // usa um listener no document, então funciona independente de qual
  // elemento interno do popover tem foco (gatilho, campo de busca, ou o
  // botão de limpar seleção).
  function close() {
    setOpen(false)
    setQuery('')
  }

  useClickOutside(containerRef, close)
  useEscapeKey(open, close)

  useEffect(() => {
    setHighlighted(0)
  }, [query, open])

  // Todo caminho de abrir usa openMenu(), todo caminho de fechar sem
  // selecionar usa close() — evita os dois ficarem dessincronizados
  // (ex: um caminho de fechamento limpando a busca e outro não).
  function openMenu() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Enter/Espaço só abrem quando o Select está FECHADO — o campo de
  // busca (handleListKeyDown) trata essas teclas de forma diferente
  // quando aberto (seleciona a opção destacada).
  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu()
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    // Escape agora é tratado globalmente por useEscapeKey (acima) — um
    // listener no document funciona independente de onde o foco esteja
    // dentro do popover, diferente de um onKeyDown local aqui que só
    // recebia o evento quando o foco estava especificamente no campo de
    // busca. Removido daqui pra não ter duas fontes de verdade pro
    // mesmo fechamento.
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const opt = filtered[highlighted]
      if (opt) {
        onChange(opt.value)
        close()
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm bg-background transition-shadow"
        style={{
          borderColor: 'var(--border)',
          boxShadow: open ? 'var(--focus-ring-primary)' : 'none',
          // O "×" de limpar é um <button> real, irmão deste gatilho
          // (não filho) — um elemento interativo não pode conter outro
          // validamente em HTML. paddingRight abre espaço pra ele não
          // sobrepor o texto selecionado.
          paddingRight: value ? 56 : 36,
        }}
      >
        <span className={selectedLabel ? '' : 'text-muted-foreground'}>
          {selectedLabel ?? placeholder ?? 'Selecionar...'}
        </span>
        <ChevronDownIcon size={14} className="text-muted-foreground shrink-0" />
      </button>

      {value && (
        <button
          type="button"
          aria-label="Limpar seleção"
          onClick={() => {
            onChange(null)
            setQuery('')
          }}
          className="absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center"
          style={{ right: 32 }}
        >
          ×
        </button>
      )}

      {open && (
        <div
          className="absolute z-10 mt-1.5 w-full rounded-lg border bg-popover overflow-hidden"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-md)' }}
        >
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleListKeyDown}
            placeholder="Buscar..."
            aria-label="Buscar"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={filtered.length > 0 ? optionId(highlighted) : undefined}
            className="w-full px-3 py-2 text-sm border-b outline-none bg-transparent"
            style={{ borderColor: 'var(--border)' }}
          />
          {/* role=listbox pertence ao elemento cujos filhos diretos são
              opções — colocar no wrapper externo (que também contém o
              input de busca) viola aria-required-children. */}
          <ul id={listboxId} role="listbox" aria-label="Opções" className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</li>
            )}
            {filtered.map((opt, i) => (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  id={optionId(i)}
                  role="option"
                  aria-selected={opt.value === value}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => {
                    onChange(opt.value)
                    close()
                  }}
                  className="w-full text-left px-3 py-2 text-sm"
                  style={
                    opt.value === value
                      ? { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }
                      : i === highlighted
                      ? { backgroundColor: 'var(--muted)' }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
