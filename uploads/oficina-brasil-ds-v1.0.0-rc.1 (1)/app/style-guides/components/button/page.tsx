'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { UploadIcon } from '@/components/icons'

export default function Page() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Button</h1>
        <p className="text-sm text-muted-foreground">
          Primitive de botão — extraído da repetição real de vários{' '}
          <code>&lt;button&gt;</code> crus já espalhados pelo sistema, não
          inventado do zero. <code>rounded-lg</code> já dominava
          esmagadoramente entre as ocorrências catalogadas, virou o
          radius padrão daqui. Anel de foco usa{' '}
          <code>var(--focus-ring-primary)</code>/
          <code>var(--focus-ring-destructive)</code> (2F, criados nesta
          mesma sprint).
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Variantes</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Tamanhos</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Com ícone</p>
        <Button icon={<UploadIcon size={15} />}>Enviar arquivo</Button>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Estados</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Desabilitado</Button>
          <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}>
            {loading ? 'Carregando...' : 'Clique pra carregar'}
          </Button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'  // padrão 'primary'
  size?: 'sm' | 'md' | 'lg'  // padrão 'md'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}`}</pre>
      </div>
    </div>
  )
}
