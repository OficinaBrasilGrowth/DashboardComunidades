'use client'

import { BrandSelect } from '@/components/brand-select'

const estados = [
  { label: 'São Paulo', value: 'sp' },
  { label: 'Rio de Janeiro', value: 'rj' },
  { label: 'Minas Gerais', value: 'mg' },
]

// Página institucional/voltada ao público. Elementos gráficos de marca
// (box, linha de marcação) são usados aqui de propósito — isso seria
// pulado numa página de dashboard/admin.
export default function ComunidadePage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto py-10 px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" style={{ color: '#00134E' }}>
          Comunidades Oficiais
        </h1>
        <p className="text-muted-foreground">
          Espaços de troca entre reparadores e marcas, com conteúdo baseado
          em experiências reais da oficina.
        </p>
      </header>

      {/* Box: canto único arredondado, emoldurando uma foto — guia de marca pág. 58.
          Radius: reaproveita o mesmo token --radius dos componentes de UI
          (12px), em vez de uma proporção separada calculada a partir do
          tamanho do box. Usando rounded-tl-[var(--radius)] explicitamente
          em vez do rounded-tl-2xl (16px) do Tailwind, que só
          coincidentemente pareceria igual mas nunca estaria de fato
          conectado ao token. */}
      <div className="flex flex-col rounded-tl-[var(--radius)] overflow-hidden border">
        <div
          className="h-48 flex items-center justify-center text-sm"
          style={{ backgroundColor: '#DAF7EF', color: '#18328A' }}
        >
          [ foto do reparador ]
        </div>
        <div className="p-5" style={{ backgroundColor: '#18328A', color: '#FFFFFF' }}>
          <p className="font-semibold">Uma comunidade forte, sempre por perto.</p>
        </div>
      </div>

      {/* Linha de marcação — guia de marca pág. 59. O guia mostra uma
          barra HORIZONTAL curta posicionada ACIMA do texto, não uma
          borda vertical à esquerda. */}
      <div className="flex flex-col gap-3">
        <div style={{ width: '48px', height: '4px', backgroundColor: '#90F252' }} />
        <p className="text-2xl font-normal" style={{ color: '#00B7A4' }}>
          Conhecimento técnico e de gestão que aumenta a performance.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Filtrar por estado</p>
        <div style={{ width: 256 }}>
          <BrandSelect options={estados} value={null} onChange={() => {}} placeholder="Selecione um estado" />
        </div>
      </div>

    </div>
  )
}
