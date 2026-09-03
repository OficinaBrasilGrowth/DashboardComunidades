import { Textarea } from '@/components/textarea'
import { Label } from '@/components/label'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Textarea</h1>
        <p className="text-sm text-muted-foreground">
          Campo de texto multi-linha. Mesmo padrão de erro/texto de ajuda do{' '}
          <a href="/style-guides/components/input" className="underline">Input</a> —
          mantido consistente em todo campo de formulário de propósito, não só parecido por coincidência.
        </p>
      </div>

      <div className="max-w-sm">
        <Label htmlFor="obs">Observações</Label>
        <Textarea id="obs" placeholder="Detalhes adicionais" helperText="Opcional" />
      </div>

      <div className="max-w-sm">
        <Label htmlFor="obs-erro" required>Motivo do cancelamento</Label>
        <Textarea id="obs-erro" placeholder="Explique o motivo" error="Este campo é obrigatório" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  helperText?: string  // ignorado se error estiver definido
}`}</pre>
      </div>
    </div>
  )
}
