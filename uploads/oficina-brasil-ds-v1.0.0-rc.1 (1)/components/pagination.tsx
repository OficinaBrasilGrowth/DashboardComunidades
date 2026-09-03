'use client'

import { ChevronLeftIcon, ChevronRightIcon } from './icons'

// Seletor de tamanho de página à esquerda, rótulo do intervalo atual,
// controles de primeira/anterior/próxima/última agrupados à direita,
// estados desabilitados para páginas limite.

export interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (n: number) => void
  itemsPerPageOptions?: number[]
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems)

  const atFirst = currentPage <= 1
  const atLast = currentPage >= totalPages

  function buttonStyle(disabled: boolean): React.CSSProperties {
    return {
      color: disabled ? 'var(--muted-foreground)' : 'var(--primary)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 text-sm flex-wrap">
      {onItemsPerPageChange && (
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          aria-label="Itens por página"
          // Padding-right extra pra acomodar a seta nativa do <select> —
          // os outros controles do DS (Input, BrandSelect) usam px-3.5
          // simétrico porque não têm essa seta embutida do navegador.
          className="rounded-lg border pl-3 pr-7 py-1.5 bg-background text-sm"
          style={{ borderColor: 'var(--border)' }}
        >
          {itemsPerPageOptions.map((n) => (
            <option key={n} value={n}>{n} linhas</option>
          ))}
        </select>
      )}

      <span style={{ color: 'var(--muted-foreground)' }}>
        {rangeStart}-{rangeEnd} de {totalItems}
      </span>

      <div className="flex items-center gap-3">
        <button type="button" aria-label="Primeira página" disabled={atFirst} onClick={() => onPageChange(1)} style={buttonStyle(atFirst)} className="flex">
          <ChevronLeftIcon size={13} /><ChevronLeftIcon size={13} className="-ml-2" />
        </button>
        <button type="button" aria-label="Página anterior" disabled={atFirst} onClick={() => onPageChange(currentPage - 1)} style={buttonStyle(atFirst)} className="flex">
          <ChevronLeftIcon size={13} />
        </button>
        <span className="px-1 font-medium" style={{ color: 'var(--foreground)' }}>{currentPage} / {totalPages}</span>
        <button type="button" aria-label="Próxima página" disabled={atLast} onClick={() => onPageChange(currentPage + 1)} style={buttonStyle(atLast)} className="flex">
          <ChevronRightIcon size={13} />
        </button>
        <button type="button" aria-label="Última página" disabled={atLast} onClick={() => onPageChange(totalPages)} style={buttonStyle(atLast)} className="flex">
          <ChevronRightIcon size={13} /><ChevronRightIcon size={13} className="-ml-2" />
        </button>
      </div>
    </div>
  )
}
