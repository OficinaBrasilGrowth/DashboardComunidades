'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/checkbox'

export default function Page() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Checkbox</h1>
        <p className="text-sm text-muted-foreground">
          Usa <code>&lt;input type="checkbox"&gt;</code> nativo, não um{' '}
          <code>role="checkbox"</code> simulado — mantém acessibilidade
          padrão do navegador de graça (Space pra marcar, leitor de tela
          anuncia o estado sem nenhum ARIA manual). Suporta estado
          indeterminado via ref + useEffect, já que o HTML não expõe isso
          como atributo.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          <code>onChange</code> recebe o valor booleano direto (
          <code>(checked: boolean) =&gt; void</code>), não o evento nativo
          do DOM — alinhado com{' '}
          <a href="/style-guides/components/select" className="underline">Select</a>,{' '}
          <a href="/style-guides/components/radio-group" className="underline">RadioGroup</a>,{' '}
          <a href="/style-guides/components/switch" className="underline">Switch</a> e{' '}
          <a href="/style-guides/components/date-picker" className="underline">DatePicker</a>,
          que também usam valor direto.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Checkbox id="ex1" label="Aceito os termos" checked={checked} onChange={setChecked} />
        <Checkbox id="ex2" label="Indeterminado" indeterminate checked={false} onChange={() => {}} />
        <Checkbox id="ex3" label="Desabilitado" disabled checked={false} onChange={() => {}} />
        <Checkbox id="ex4" label="Com erro" error="Campo obrigatório" checked={false} onChange={() => {}} />
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        Radius fixo em 6px no quadrado visual, não o token rounded-md do
        projeto — achado durante teste real: rounded-md mapeia pra
        calc(var(--radius) - 2px) = 10px, que numa caixa de 20px vira 50%
        (um círculo perfeito). O token funciona bem pra cards/botões, mas é
        desproporcional pra um elemento tão pequeno.
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  indeterminate?: boolean
  error?: string
  onChange?: (checked: boolean) => void  // valor direto, não o evento
}`}</pre>
      </div>
    </div>
  )
}
