'use client'

import { useState } from 'react'
import { ChevronDownIcon } from './icons'

// Cabeçalhos de coluna funcionam também como gatilhos de ordenação com
// indicador direcional, destaque no hover por linha, estado vazio
// dedicado em vez de uma tabela em branco, estado de carregamento
// substitui as linhas em vez de esconder o cabeçalho. Combina com o
// componente Pagination já existente em vez de ter sua própria
// paginação embutida — uma tabela não deveria ser dona desse estado.

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  accessor?: (row: T) => string | number
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  loading?: boolean
  emptyMessage?: string
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T>({ columns, data, rowKey, loading, emptyMessage = 'Nenhum resultado encontrado' }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  function handleSort(col: Column<T>) {
    if (!col.sortable) return
    if (sortKey !== col.key) {
      setSortKey(col.key)
      setSortDir('asc')
    } else if (sortDir === 'asc') {
      setSortDir('desc')
    } else {
      setSortKey(null)
      setSortDir(null)
    }
  }

  const sortedData = (() => {
    if (!sortKey || !sortDir) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.accessor) return data
    const copy = [...data]
    copy.sort((a, b) => {
      const av = col.accessor!(a)
      const bv = col.accessor!(b)
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  })()

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      {/* O wrapper externo usa overflow-hidden só pra clipar os cantos
          arredondados — sem um wrapper interno com scroll próprio, uma
          tabela mais larga que a viewport (comum em mobile) ficaria
          simplesmente cortada, não rolável. */}
      <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: 'var(--muted)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 font-semibold"
                style={{ color: 'var(--muted-foreground)' }}
                aria-sort={
                  sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : col.sortable ? 'none' : undefined
                }
              >
                {col.sortable ? (
                  // Um <button> real dentro do <th>, não o <th> com
                  // onClick direto — o navegador já torna o button
                  // focável/acionável por Enter e Espaço de graça, sem
                  // código extra de teclado. Um <th> com onClick sozinho
                  // não entra na sequência de Tab.
                  <button
                    type="button"
                    onClick={() => handleSort(col)}
                    className="inline-flex items-center gap-1 -m-1 p-1 rounded"
                    style={{ userSelect: 'none' }}
                  >
                    {col.header}
                    <ChevronDownIcon
                      size={12}
                      className="transition-transform"
                      style={
                        sortKey === col.key
                          ? { transform: sortDir === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 1 }
                          : { opacity: 0.35 }
                      }
                    />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1">{col.header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i}`} style={{ borderTop: '1px solid var(--border)' }}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 rounded" style={{ backgroundColor: 'var(--muted)', width: '70%' }} />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: 'var(--muted-foreground)' }}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            sortedData.map((row) => (
              <tr
                key={rowKey(row)}
                style={{ borderTop: '1px solid var(--border)' }}
                className="transition-colors hover:bg-muted"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3" style={{ color: 'var(--foreground)' }}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
