'use client'

import { useState } from 'react'
import { Alert } from '@/components/alert'

export default function Page() {
  const [show, setShow] = useState(true)

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Alert</h1>
        <p className="text-sm text-muted-foreground">
          Diferente do <a href="/style-guides/components/toast" className="underline">Toast</a>{' '}
          (temporário, flutua num canto), o Alert é um bloco persistente
          inline na página — pra avisos que a pessoa precisa continuar vendo
          até resolver ou fechar manualmente. "info" e "success" usam cores
          reais do guia (azulClaro, verde); "warning" e "error" usam tons de
          fundo claro <strong>gerados</strong> (ver <code>lib/tokens.ts</code>,{' '}
          <code>semanticTints</code>, sinalizado lá) já que o guia não define
          nenhum tom de aviso/erro.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {show && (
          <Alert variant="success" title="Cadastro concluído" onDismiss={() => setShow(false)}>
            Sua oficina já pode receber pedidos.
          </Alert>
        )}
        <Alert variant="info" title="Nova funcionalidade disponível">
          Agora você pode acompanhar o status do reparo em tempo real.
        </Alert>
        <Alert variant="warning" title="Documento pendente">
          Envie o comprovante de endereço para continuar.
        </Alert>
        <Alert variant="error" title="Falha no pagamento" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'  // padrão 'info'
  title: string
  children?: ReactNode       // descrição opcional
  onDismiss?: () => void     // mostra o × quando definido
}`}</pre>
      </div>
    </div>
  )
}
