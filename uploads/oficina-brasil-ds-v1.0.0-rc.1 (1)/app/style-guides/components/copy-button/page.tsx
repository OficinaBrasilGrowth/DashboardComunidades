import { CopyButton } from '@/components/copy-button'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">CopyButton</h1>
        <p className="text-sm text-muted-foreground">
          Copia um valor pra área de transferência e mostra uma confirmação
          breve "Copiado!". Falha silenciosamente se a Clipboard API não
          estiver disponível (ex: contexto inseguro) — nenhum erro é mostrado
          ao usuário, a confirmação simplesmente não aparece.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-mono">oficinabrasil.com.br/x9k2</span>
        <CopyButton value="https://oficinabrasil.com.br/x9k2" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface CopyButtonProps {
  value: string
  className?: string
}`}</pre>
      </div>
    </div>
  )
}
