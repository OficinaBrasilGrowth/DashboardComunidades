'use client'

import { useState } from 'react'
import { RadioGroup } from '@/components/radio-group'

export default function Page() {
  const [value, setValue] = useState<string | null>('sp')

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">RadioGroup</h1>
        <p className="text-sm text-muted-foreground">
          Usa <code>&lt;input type="radio"&gt;</code>{' '}
          nativos compartilhando o mesmo <code>name</code>, o que já dá
          navegação por seta (↑↓←→) entre as opções de graça, direto do
          navegador, sem nenhum JavaScript de teclado escrito aqui.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Clique numa opção, depois use as setas ↑↓</p>
        <RadioGroup
          name="estado-demo"
          options={[
            { label: 'São Paulo', value: 'sp' },
            { label: 'Rio de Janeiro', value: 'rj' },
            { label: 'Minas Gerais', value: 'mg' },
          ]}
          value={value}
          onChange={setValue}
        />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface RadioOption {
  label: string
  value: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}`}</pre>
      </div>
    </div>
  )
}
