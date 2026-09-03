import { Label } from '@/components/label'
import { Input } from '@/components/input'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Label</h1>
        <p className="text-sm text-muted-foreground">
          Rótulo de campo de formulário com indicador opcional de campo
          obrigatório. Estende todos os atributos nativos de{' '}
          <code>&lt;label&gt;</code> — passe <code>htmlFor</code> igual ao{' '}
          <code>id</code> do campo pra associá-los.
        </p>
      </div>

      <div className="max-w-sm">
        <Label htmlFor="ex" required>Nome completo</Label>
        <Input id="ex" placeholder="Digite seu nome" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean  // mostra um asterisco vermelho
}`}</pre>
      </div>
    </div>
  )
}
