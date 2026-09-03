'use client'

import { useState } from 'react'
import { Slider } from '@/components/slider'

export default function Page() {
  const [val, setVal] = useState(30)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Slider</h1>
        <p className="text-sm text-muted-foreground">
          Usa <code>&lt;input type="range"&gt;</code> nativo, não um{' '}
          <code>role="slider"</code> simulado — dá navegação por teclado de
          graça (setas Esquerda/Direita mudam o valor, Home/End vão pro
          mínimo/máximo), mesmo princípio já usado no{' '}
          <a href="/style-guides/components/checkbox" className="underline">Checkbox</a>/
          <a href="/style-guides/components/radio-group" className="underline">RadioGroup</a>.
          O estilo do thumb precisa de CSS global (
          <code>globals.css</code>, classe <code>.ds-slider</code>) porque
          os pseudo-elementos de thumb de range exigem prefixo de
          fornecedor — não dá pra fazer só com Tailwind.
        </p>
      </div>

      <div className="max-w-sm">
        <Slider value={val} onChange={setVal} label="Volume" />
      </div>

      <div className="max-w-sm">
        <Slider value={70} onChange={() => {}} label="Desabilitado" disabled />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number   // padrão 0
  max?: number   // padrão 100
  step?: number  // padrão 1
  label?: string
  disabled?: boolean
}`}</pre>
      </div>
    </div>
  )
}
