'use client'

import { ToastProvider, useToast } from '@/components/toast'

function Trigger() {
  const { show } = useToast()
  return (
    <div className="flex gap-3">
      <button
        onClick={() => show('Reparador salvo com sucesso!', 'success')}
        className="rounded-lg px-4 py-2 text-sm font-semibold"
        style={{ backgroundColor: 'var(--success-surface)', color: 'var(--success-surface-foreground)' }}
      >
        Disparar sucesso
      </button>
      <button
        onClick={() => show('Falha ao salvar. Tente novamente.', 'error')}
        className="rounded-lg px-4 py-2 text-sm font-semibold"
        style={{ backgroundColor: 'var(--destructive-surface)', color: 'var(--destructive-surface-foreground)' }}
      >
        Disparar erro
      </button>
      <button
        onClick={() => show('Sincronização concluída.', 'info')}
        className="rounded-lg px-4 py-2 text-sm font-semibold"
        style={{ backgroundColor: 'var(--info-surface)', color: 'var(--info-surface-foreground)' }}
      >
        Disparar info
      </button>
    </div>
  )
}

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Toast</h1>
        <p className="text-sm text-muted-foreground">
          Notificações empilháveis que somem sozinhas: canto fixo, some
          sozinho, fechável. Acessibilidade: usa <code>role="status"</code> +{' '}
          <code>aria-live="polite"</code> — deliberadamente não "assertive",
          já que isso seria disruptivo demais para confirmações rotineiras. A
          região live existe no DOM desde o carregamento inicial (verificado
          via Playwright), então o primeiro toast nunca passa despercebido
          por leitores de tela.
        </p>
      </div>

      <ToastProvider>
        <Trigger />
      </ToastProvider>

      <div>
        <p className="text-sm font-medium mb-2">Uso</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`// Envolva seu app uma vez:
<ToastProvider>
  <App />
</ToastProvider>

// Em qualquer lugar dentro, dispare um toast:
const { show } = useToast()
show('Mensagem aqui', 'success')  // 'success' | 'error' | 'info'`}</pre>
      </div>

      <div className="text-xs text-muted-foreground border-l-4 border-red-400 pl-4">
        Um erro verdadeiramente urgente e bloqueante deveria usar um Modal em
        vez de um toast — um toast de região "polite" pode passar
        despercebido se o foco de quem usa leitor de tela estiver em outro
        lugar.
      </div>
    </div>
  )
}
