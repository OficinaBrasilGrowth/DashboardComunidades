'use client'

import { useState } from 'react'
import { Pagination } from '@/components/pagination'

export default function Page() {
  const [page, setPage] = useState(1)
  const [ipp, setIpp] = useState(5)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Pagination</h1>
        <p className="text-sm text-muted-foreground">
          Controles de página com seletor opcional de itens por página:
          seletor de tamanho de página à esquerda, rótulo de intervalo,
          primeira/anterior/próxima/última agrupados à direita. Combina com{' '}
          <a href="/style-guides/components/data-table" className="underline">DataTable</a>{' '}
          em vez de vir embutido nele.
        </p>
      </div>

      <Pagination
        currentPage={page}
        totalItems={100}
        itemsPerPage={ipp}
        onPageChange={setPage}
        onItemsPerPageChange={setIpp}
      />

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange?: (n: number) => void
  itemsPerPageOptions?: number[]  // padrão [5, 10, 25, 50]
}`}</pre>
      </div>
    </div>
  )
}
