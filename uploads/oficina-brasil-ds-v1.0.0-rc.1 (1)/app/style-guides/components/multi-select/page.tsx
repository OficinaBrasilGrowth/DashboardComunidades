'use client'

import { useState } from 'react'
import { MultiSelect } from '@/components/multi-select'

export default function Page() {
  const [selected, setSelected] = useState<string[]>(['sp'])

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">MultiSelect</h1>
        <p className="text-sm text-muted-foreground">
          Mesma referência de interação do{' '}
          <a href="/style-guides/components/select" className="underline">BrandSelect</a>,{' '}
          mas com diferenças reais de comportamento que justificam um
          componente separado: clicar numa opção alterna ela (não fecha o
          popover, permite selecionar mais de uma em sequência), e o
          gatilho mostra as seleções como chips removíveis. Reaproveita{' '}
          <code>normalizeText</code> (busca sem acento) e{' '}
          <code>useClickOutside</code> do BrandSelect, não duplica.
        </p>
      </div>

      <div className="max-w-sm">
        <MultiSelect
          label="Estados"
          options={[
            { label: 'São Paulo', value: 'sp' },
            { label: 'Rio de Janeiro', value: 'rj' },
            { label: 'Minas Gerais', value: 'mg' },
          ]}
          value={selected}
          onChange={setSelected}
          placeholder="Selecione estados"
        />
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        Bug real encontrado durante o teste: clicar numa opção move o foco
        pro botão da própria opção — que não tinha nenhum{' '}
        <code>onKeyDown</code> de Escape (só o gatilho e o campo de busca
        tinham). Resultado: <code>Escape</code> não fechava depois de
        selecionar pelo menos uma opção com clique. Mesmo padrão de bug já
        corrigido no{' '}
        <a href="/style-guides/components/popover" className="underline">Popover</a>{' '}
        — corrigido com um listener no <code>document</code>, que
        funciona independente de onde o foco estiver.
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface MultiSelectOption {
  label: string
  value: string
}

// Nome acessível é obrigatório — exatamente um dos dois, nunca os dois
// nem nenhum (união discriminada, aplicada em tempo de compilação):
type MultiSelectAccessibleName =
  | { label: string; ariaLabelledBy?: undefined }
  | { label?: undefined; ariaLabelledBy: string }

type MultiSelectProps = {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
} & MultiSelectAccessibleName`}</pre>
        <p className="text-xs text-muted-foreground mt-2">
          Use <code>label</code> quando não existe um{' '}
          <code>{'<label>'}</code> visível associado (é o que gera o{' '}
          <code>aria-label</code>). Use <code>ariaLabelledBy</code> com o{' '}
          <code>id</code> de um <code>{'<label>'}</code> visível já
          existente, em vez de duplicar o texto — nunca os dois ao mesmo
          tempo, o TypeScript não deixa.
        </p>
      </div>
    </div>
  )
}
