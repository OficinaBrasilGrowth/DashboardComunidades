'use client'

import { useState, useEffect, useRef } from 'react'
import { useClickOutside } from '../lib/use-click-outside'
import { useEscapeKey } from '../lib/use-escape-key'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

// Grid de calendário com navegação de mês, seleção de intervalo clicando
// início depois fim, intervalo destacado entre as duas datas, linha de
// ação Limpar/Aplicar, campos de texto de digitação direta início/fim,
// atalhos rápidos de período. Nomes de mês/dia em pt-BR.
//
// O destaque de "dentro do intervalo" usa var(--secondary) — que tem o
// valor azulClaro (#DAF7EF) no light mode e adapta sozinho pro dark
// mode (vira azul) — confirmado com contraste real (9.95:1) antes de
// assumir que o texto por cima continuaria legível com o fundo mudando
// de tom entre os temas.

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DatePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function isBetween(d: Date, a: Date | null, b: Date | null) {
  if (!a || !b) return false
  return d > a && d < b
}
function formatDate(d: Date | null) {
  if (!d) return '--/--/----'
  return d.toLocaleDateString('pt-BR')
}
function isoKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

// Campos de texto de digitação direta: mascaram dígitos em dd/mm/aaaa
// conforme a pessoa digita, mesma técnica do mask="phone" do Input.
function formatDateInputBR(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}
function parseDateBR(str: string): Date | null {
  const match = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null
  const [, dd, mm, yyyy] = match
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  // Rejeita datas que "estouraram" (ex: 31/02 silenciosamente virando 3 de março).
  if (d.getDate() !== Number(dd) || d.getMonth() !== Number(mm) - 1 || d.getFullYear() !== Number(yyyy)) return null
  return d
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

interface Preset {
  label: string
  getRange: () => DateRange
}

const PRESETS: Preset[] = [
  {
    label: 'Últimos 7 dias',
    getRange: () => {
      const end = startOfDay(new Date())
      const start = new Date(end); start.setDate(start.getDate() - 6)
      return { start, end }
    },
  },
  {
    label: 'Últimos 30 dias',
    getRange: () => {
      const end = startOfDay(new Date())
      const start = new Date(end); start.setDate(start.getDate() - 29)
      return { start, end }
    },
  },
  {
    label: 'Este mês',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = startOfDay(now)
      return { start, end }
    },
  },
  {
    label: 'Mês passado',
    getRange: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start, end }
    },
  },
]

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(value.start?.getFullYear() ?? new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(value.start?.getMonth() ?? new Date().getMonth())
  const [draft, setDraft] = useState<DateRange>(value)
  const [startText, setStartText] = useState(formatDate(value.start))
  const [endText, setEndText] = useState(formatDate(value.end))
  // Alvo do roving tabindex — a única célula de dia que faz parte da
  // sequência de Tab a qualquer momento (conforme o padrão "grid" das
  // WAI-ARIA APG). Começa na data de início selecionada, se houver, ou no
  // dia 1 do mês.
  const [focusedDate, setFocusedDate] = useState(() => value.start ?? new Date(viewYear, viewMonth, 1))
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const pendingFocusKey = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Mantém os campos de texto sincronizados sempre que o rascunho muda via
  // o calendário ou um preset — pra digitar e clicar nunca ficarem em desacordo.
  useEffect(() => {
    setStartText(draft.start ? formatDate(draft.start) : '')
    setEndText(draft.end ? formatDate(draft.end) : '')
  }, [draft])

  // Clique fora e Esc descartam o rascunho não aplicado, restaurando pro
  // último valor de fato aplicado (`value`) — só "Aplicar" grava o
  // rascunho de verdade. Esc também devolve o foco ao gatilho; clique
  // fora não força foco, já que o clique do usuário já foi uma intenção
  // explícita de interagir com outra coisa.
  function closeAndDiscard() {
    setOpen(false)
    setDraft(value)
  }

  useClickOutside(containerRef, closeAndDiscard)
  useEscapeKey(open, () => {
    closeAndDiscard()
    triggerRef.current?.focus()
  })

  // Move o foco pro grid quando o painel abre — sem isso, uma pessoa usando
  // teclado não tem como alcançar as células de dia exceto um Tab extra
  // depois do gatilho, o que não é óbvio. Cai em qualquer dia que seja o
  // alvo atual do roving-tabindex (data de início selecionada, ou o dia 1
  // do mês por padrão).
  useEffect(() => {
    if (!open) return
    const key = isoKey(focusedDate)
    requestAnimationFrame(() => {
      dayRefs.current.get(key)?.focus()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Depois de um re-render disparado por atravessar um limite de mês, foca
  // o botão de dia pro qual a navegação por seta estava indo.
  useEffect(() => {
    if (!pendingFocusKey.current) return
    const btn = dayRefs.current.get(pendingFocusKey.current)
    if (btn) {
      btn.focus()
      pendingFocusKey.current = null
    }
  }, [viewMonth, viewYear])

  function goToMonth(d: Date) {
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  function handleDayClick(day: number) {
    const clicked = new Date(viewYear, viewMonth, day)
    setFocusedDate(clicked)
    if (!draft.start || (draft.start && draft.end)) {
      setDraft({ start: clicked, end: null })
    } else if (clicked < draft.start) {
      setDraft({ start: clicked, end: draft.start })
    } else {
      setDraft({ start: draft.start, end: clicked })
    }
  }

  function handleStartTextChange(raw: string) {
    const formatted = formatDateInputBR(raw)
    setStartText(formatted)
    const parsed = parseDateBR(formatted)
    if (parsed) {
      setDraft((prev) => (prev.end && parsed > prev.end ? { start: prev.end, end: parsed } : { start: parsed, end: prev.end }))
      goToMonth(parsed)
    }
  }
  function handleEndTextChange(raw: string) {
    const formatted = formatDateInputBR(raw)
    setEndText(formatted)
    const parsed = parseDateBR(formatted)
    if (parsed) {
      setDraft((prev) => (prev.start && parsed < prev.start ? { start: parsed, end: prev.start } : { start: prev.start, end: parsed }))
      goToMonth(parsed)
    }
  }

  function applyPreset(preset: Preset) {
    const range = preset.getRange()
    setDraft(range)
    if (range.end) goToMonth(range.end)
  }

  function changeMonth(delta: number) {
    let m = viewMonth + delta
    let y = viewYear
    if (m < 0) { m = 11; y -= 1 }
    if (m > 11) { m = 0; y += 1 }
    setViewMonth(m); setViewYear(y)
  }

  // O padrão de grid das WAI-ARIA APG inspirou esse comportamento de
  // teclado (Left/Right movem por dia, Up/Down por semana, Home/End pulam
  // pro início/fim da linha, PageUp/PageDown mudam o mês inteiro), mas isso
  // NÃO usa a estrutura formal ARIA role="grid"/role="row"/role="gridcell"
  // — role="grid" sem role="row" envolvendo cada semana viola
  // aria-required-children/aria-required-parent. Optou-se por botões
  // simples com aria-label descritivo (data completa) e aria-pressed pro
  // estado de seleção — continua totalmente operável por teclado e amigável
  // a leitor de tela, só não reivindicando conformidade estrita com o grid
  // widget ARIA.
  function handleGridKeyDown(e: React.KeyboardEvent, day: number) {
    const current = new Date(viewYear, viewMonth, day)
    let next: Date | null = null

    if (e.key === 'ArrowRight') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1)
    else if (e.key === 'ArrowLeft') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1)
    else if (e.key === 'ArrowDown') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7)
    else if (e.key === 'ArrowUp') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7)
    else if (e.key === 'Home') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - current.getDay())
    else if (e.key === 'End') next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + (6 - current.getDay()))
    else if (e.key === 'PageUp') next = new Date(current.getFullYear(), current.getMonth() - 1, current.getDate())
    else if (e.key === 'PageDown') next = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate())
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleDayClick(day)
      return
    } else {
      return
    }

    e.preventDefault()
    setFocusedDate(next)

    const monthChanged = next.getMonth() !== viewMonth || next.getFullYear() !== viewYear
    if (monthChanged) {
      pendingFocusKey.current = isoKey(next)
      setViewYear(next.getFullYear())
      setViewMonth(next.getMonth())
    } else {
      dayRefs.current.get(isoKey(next))?.focus()
    }
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startWeekday = firstWeekday(viewYear, viewMonth)
  const cells = [...Array(startWeekday).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)]

  // Assim que uma data de início é escolhida e ainda não existe data de
  // fim, avisa isso explicitamente em vez de deixar ambíguo.
  const awaitingEndDate = !!draft.start && !draft.end

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg border px-3.5 py-2.5 text-sm flex items-center gap-2.5 transition-shadow"
        style={{ borderColor: 'var(--border)', boxShadow: open ? 'var(--focus-ring-primary)' : 'none' }}
      >
        <CalendarIcon size={15} className="text-muted-foreground" />
        {value.start ? `${formatDate(value.start)} - ${formatDate(value.end)}` : 'Selecionar período'}
      </button>

      {open && (
        <div
          className="absolute z-10 mt-1.5 rounded-lg border p-4"
          style={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', width: '336px', boxShadow: 'var(--shadow-md)' }}
        >
          {/* Direct-entry fields */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1">
              <label className="text-xs block mb-1" style={{ color: 'var(--muted-foreground)' }} htmlFor="dp-start">Início</label>
              <input
                id="dp-start"
                value={startText}
                onChange={(e) => handleStartTextChange(e.target.value)}
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs block mb-1" style={{ color: 'var(--muted-foreground)' }} htmlFor="dp-end">Término</label>
              <input
                id="dp-end"
                value={endText}
                onChange={(e) => handleEndTextChange(e.target.value)}
                placeholder="dd/mm/aaaa"
                inputMode="numeric"
                className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                style={{
                  borderColor: awaitingEndDate ? 'var(--primary)' : 'var(--border)',
                  boxShadow: awaitingEndDate ? 'var(--focus-ring-primary)' : 'none',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
          </div>

          {awaitingEndDate && (
            <p role="status" className="text-xs mb-3 m-0" style={{ color: 'var(--primary)' }}>
              Início selecionado — agora escolha a data final.
            </p>
          )}

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs rounded-lg px-2.5 py-1.5 border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" style={{ color: 'var(--primary)' }}><ChevronLeftIcon size={16} /></button>
              <p className="font-semibold m-0" style={{ color: 'var(--popover-foreground)' }} aria-live="polite">{MESES[viewMonth]} {viewYear}</p>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" style={{ color: 'var(--primary)' }}><ChevronRightIcon size={16} /></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
              {DIAS.map((d) => (
                <span key={d} style={{ color: 'var(--muted-foreground)' }}>{d}</span>
              ))}
            </div>

            <div aria-label={`Dias de ${MESES[viewMonth]} de ${viewYear}`} className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <span key={i} />
                const cellDate = new Date(viewYear, viewMonth, day)
                const isStart = isSameDay(cellDate, draft.start)
                const isEnd = isSameDay(cellDate, draft.end)
                const inRange = isBetween(cellDate, draft.start, draft.end)
                const isRovingTarget = isSameDay(cellDate, focusedDate)
                const isSelected = isStart || isEnd
                const bg = isSelected ? 'var(--primary)' : inRange ? 'var(--secondary)' : 'transparent'
                const fg = isSelected ? 'var(--primary-foreground)' : 'var(--popover-foreground)'
                return (
                  <button
                    key={i}
                    ref={(el) => {
                      if (el) dayRefs.current.set(isoKey(cellDate), el)
                      else dayRefs.current.delete(isoKey(cellDate))
                    }}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={cellDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    tabIndex={isRovingTarget ? 0 : -1}
                    onClick={() => handleDayClick(day)}
                    onKeyDown={(e) => handleGridKeyDown(e, day)}
                    onFocus={() => setFocusedDate(cellDate)}
                    className="text-xs text-center rounded-lg py-1"
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setDraft({ start: null, end: null })}
              className="text-sm rounded-lg px-3.5 py-2 border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={() => { onChange(draft); setOpen(false) }}
              className="text-sm rounded-lg px-3.5 py-2 font-medium"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', boxShadow: 'var(--shadow-button-primary)' }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
