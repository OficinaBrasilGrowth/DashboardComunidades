'use client'

import { useState } from 'react'
import { Switch } from '@/components/switch'

export default function Page() {
  const [on, setOn] = useState(false)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Switch</h1>
        <p className="text-sm text-muted-foreground">
          Trilho + círculo deslizante. Diferente do Checkbox e do
          RadioGroup, não existe um <code>&lt;input&gt;</code> nativo pra
          "switch" — segue o padrão WAI-ARIA "switch" com{' '}
          <code>&lt;button role="switch" aria-checked&gt;</code>, que já dá
          Space/Enter pra alternar de graça via o comportamento nativo de
          button.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Switch id="ex1" label="Notificações ativas" checked={on} onChange={setOn} />
        <Switch id="ex2" label="Desabilitado" checked={false} onChange={() => {}} disabled />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
}`}</pre>
      </div>
    </div>
  )
}
