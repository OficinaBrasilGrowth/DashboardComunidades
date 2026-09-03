'use client'

import { useState } from 'react'
import { FilterBar } from '@/components/filter-bar'
import { BrandSelect } from '@/components/brand-select'
import { Input } from '@/components/input'
import { Label } from '@/components/label'

const CATEGORIAS = [
  { label: 'Vendas', value: 'vendas' },
  { label: 'Marketing', value: 'marketing' },
]

export default function Page() {
  // O Select de categoria conecta ao mesmo array de filtros ativos que
  // os chips usam, igual um consumidor real faria: escolher uma
  // categoria cria/atualiza o chip "Categoria: X"; remover o chip (pelo
  // X ou por "Limpar tudo") também limpa a seleção do Select, não só o
  // chip visualmente.
  const [categoria, setCategoria] = useState<string | null>(null)
  const [periodoFilter] = useState({ key: 'periodo', label: 'Período: 01/08 - 15/08' })

  const filters = [
    periodoFilter,
    ...(categoria
      ? [{ key: 'categoria', label: `Categoria: ${CATEGORIAS.find((c) => c.value === categoria)?.label}` }]
      : []),
  ]

  function removeFilter(key: string) {
    if (key === 'categoria') setCategoria(null)
    // periodoFilter não tem um jeito de remover nessa demo — é fixo, só ilustrativo
  }

  function clearAll() {
    setCategoria(null)
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">FilterBar</h1>
        <p className="text-sm text-muted-foreground">
          Padrão de "filtros ativos como tags fecháveis + ação de limpar
          tudo". Composicional de propósito: não reimplementa Select, Input
          ou DatePicker — esses já existem no design system. O valor novo
          aqui é só a organização (linha consistente, quebra em telas
          pequenas) e o resumo de filtros ativos como chips removíveis, que
          nenhum componente existente cobria.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Escolha uma categoria — o chip reflete a escolha de verdade</p>
        <FilterBar activeFilters={filters} onRemoveFilter={removeFilter} onClearAll={clearAll}>
          <div style={{ width: 200 }}>
            <Label htmlFor="cat">Categoria</Label>
            <BrandSelect
              options={CATEGORIAS}
              value={categoria}
              onChange={setCategoria}
              placeholder="Selecione"
            />
          </div>
          <div style={{ width: 200 }}>
            <Label htmlFor="busca">Buscar</Label>
            <Input id="busca" placeholder="Nome ou ID" />
          </div>
        </FilterBar>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ActiveFilter {
  key: string
  label: string  // ex: "Período: 01/08 - 15/08"
}

interface FilterBarProps {
  children: ReactNode           // os controles de filtro (Select, Input, DatePicker...)
  activeFilters?: ActiveFilter[]
  onRemoveFilter?: (key: string) => void
  onClearAll?: () => void
}`}</pre>
      </div>
    </div>
  )
}
