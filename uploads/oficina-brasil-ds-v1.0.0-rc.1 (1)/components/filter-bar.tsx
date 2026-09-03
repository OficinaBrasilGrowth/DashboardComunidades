'use client'

import type { ReactNode } from 'react'

// Padrão de "filtros ativos como tags fecháveis + ação de limpar tudo".
//
// Composicional de propósito: o FilterBar não reimplementa Select, Input ou
// DatePicker — esses já existem no design system. O valor novo aqui é só a
// organização (linha consistente, quebra em telas pequenas) e o resumo de
// filtros ativos como chips, que nenhum componente existente cobria.

export interface ActiveFilter {
  key: string
  label: string
}

export interface FilterBarProps {
  children: ReactNode
  activeFilters?: ActiveFilter[]
  onRemoveFilter?: (key: string) => void
  onClearAll?: () => void
}

export function FilterBar({ children, activeFilters = [], onRemoveFilter, onClearAll }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3 flex-wrap">{children}</div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {filter.label}
              {onRemoveFilter && (
                <button
                  type="button"
                  aria-label={`Remover filtro ${filter.label}`}
                  onClick={() => onRemoveFilter(filter.key)}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium underline"
              style={{ color: 'var(--primary)' }}
            >
              Limpar tudo
            </button>
          )}
        </div>
      )}
    </div>
  )
}
