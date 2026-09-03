'use client'

import { useState, useMemo, useRef, useEffect, useId } from 'react'
import { ChevronDownIcon } from './icons'
import { normalizeText } from '../lib/normalize-text'
import { useClickOutside } from '../lib/use-click-outside'
import { useEscapeKey } from '../lib/use-escape-key'

// Mesma referência de interação do BrandSelect, mas com diferenças reais
// de comportamento que justificam um componente separado em vez de uma
// prop `multiple`: clicar numa opção alterna ela (não fecha o popover,
// permite selecionar mais de uma em sequência), e o gatilho mostra as
// seleções como chips removíveis em vez de um texto único. Reaproveita
// normalizeText (busca sem acento) e useClickOutside do BrandSelect, não
// duplica.

export interface MultiSelectOption {
  label: string
  value: string
}

// Nome acessível é obrigatório — exatamente uma das duas formas
// (união discriminada, não as duas nem nenhuma). Um combobox sem nome
// acessível explícito é o tipo de problema que só aparece em auditoria
// de acessibilidade real, não em uso normal — mais barato forçar a
// decisão em tempo de compilação do que descobrir depois. Se já existe
// um <label> visível associado, use `ariaLabelledBy` com o id desse
// label em vez de duplicar o texto num `label` solto.
export type MultiSelectAccessibleName =
  | { label: string; ariaLabelledBy?: undefined }
  | { label?: undefined; ariaLabelledBy: string }

export type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
} & MultiSelectAccessibleName

export function MultiSelect({ options, value, onChange, placeholder, label, ariaLabelledBy }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const listboxId = useId()
  const optionId = (i: number) => `${listboxId}-option-${i}`
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query) return options
    const q = normalizeText(query)
    return options.filter((opt) => normalizeText(opt.label).includes(q))
  }, [options, query])

  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  // Centraliza os dois caminhos de fechamento sem aplicar seleção
  // (clique fora e Esc) numa função só, pra sempre limpar a busca de
  // forma consistente.
  function close() {
    setOpen(false)
    setQuery('')
  }

  function openMenu() {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  useClickOutside(containerRef, close)

  useEffect(() => {
    setHighlighted(0)
  }, [query, open])

  // Clicar numa opção move o foco pro próprio botão da opção clicada —
  // por isso Escape precisa de um listener no document (useEscapeKey),
  // não um onKeyDown local só no gatilho/campo de busca, que nunca
  // receberia o evento nesse caso.
  useEscapeKey(open, close)

  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  // O "×" de remover cada chip precisa ser um <button> real — um
  // elemento interativo não pode conter outro validamente em HTML (o
  // navegador "achata" a interação pro elemento de fora). Como o
  // gatilho precisa conter MÚLTIPLOS botões de remover (um por chip),
  // a correção não é puxar um pra fora (como no BrandSelect, que só
  // tem um "×" único) — o gatilho em si é um <div role="combobox">, com
  // o comportamento de teclado de abrir/fechar recriado manualmente (um
  // <button> nativo ganha Enter/Espaço disparando onClick de graça; um
  // <div> não, por isso handleTriggerKeyDown trata os dois casos
  // explicitamente). Isso libera os "×" de cada chip pra serem <button>
  // reais, validamente aninhados dentro de um <div>, não de outro
  // elemento interativo.
  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    // Sem essa checagem, o keydown do botão de remover chip (um filho
    // deste container) propagaria pra cá e "Enter" seria interceptado
    // incondicionalmente — chamando preventDefault() ANTES do navegador
    // traduzir Enter em click no botão focado, suprimindo a remoção, e
    // chamando openMenu() por engano no lugar. `e.target ===
    // e.currentTarget` garante que só o teclado no PRÓPRIO container
    // (não em algo dentro dele, como um botão de remover) dispara
    // abrir/fechar o menu.
    if (e.target !== e.currentTarget) return
    if (open) return // o campo de busca (handleListKeyDown) trata as teclas nesse estado
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu()
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
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
      if (opt) toggle(opt.value)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        role="combobox"
        tabIndex={0}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        {...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : { 'aria-label': label })}
        className="w-full flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm bg-background transition-shadow gap-2 cursor-pointer"
        style={{ borderColor: 'var(--border)', boxShadow: open ? 'var(--focus-ring-primary)' : 'none', minHeight: 44 }}
      >
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {selectedOptions.length === 0 && (
            <span className="text-muted-foreground">{placeholder ?? 'Selecionar...'}</span>
          )}
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded-full pl-2.5 pr-1 py-0.5 text-xs font-medium"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {opt.label}
              <button
                type="button"
                aria-label={`Remover ${opt.label}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggle(opt.value)
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <ChevronDownIcon size={14} className="text-muted-foreground shrink-0" />
      </div>

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
            aria-controls={listboxId}
            aria-activedescendant={filtered.length > 0 ? optionId(highlighted) : undefined}
            className="w-full px-3 py-2 text-sm border-b outline-none bg-transparent"
            style={{ borderColor: 'var(--border)' }}
          />
          <ul id={listboxId} role="listbox" aria-multiselectable="true" aria-label="Opções" className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li role="presentation" className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</li>
            )}
            {filtered.map((opt, i) => {
              const isSelected = value.includes(opt.value)
              return (
                <li key={opt.value} role="presentation">
                  <button
                    type="button"
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => toggle(opt.value)}
                    className="w-full text-left px-3 py-2 text-sm flex items-center gap-2"
                    style={
                      isSelected
                        ? { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }
                        : i === highlighted
                        ? { backgroundColor: 'var(--muted)' }
                        : undefined
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center"
                      style={{
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                      }}
                    >
                      {isSelected && <span style={{ color: 'var(--primary-foreground)', fontSize: 9 }}>✓</span>}
                    </span>
                    {opt.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
