'use client'

import { useState } from 'react'
import { BrandSelect } from '@/components/brand-select'

const cidades = [
  { label: 'São Paulo', value: 'sp' },
  { label: 'Brasília', value: 'df' },
  { label: 'Belém', value: 'pa' },
  { label: 'Salvador', value: 'ba' },
  { label: 'Vitória', value: 'es' },
]

export default function SelectShowcasePage() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">BrandSelect</h1>
        <p className="text-sm text-muted-foreground">
          Campo de busca, botão de limpar, opção ativa destacada. A busca é
          insensível a acento: digitar "sao" encontra "São Paulo".
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Padrão</p>
        <div style={{ width: 256 }}>
          <BrandSelect
            options={cidades}
            value={value}
            onChange={setValue}
            placeholder="Selecione uma cidade"
          />
        </div>
      </div>
    </div>
  )
}
