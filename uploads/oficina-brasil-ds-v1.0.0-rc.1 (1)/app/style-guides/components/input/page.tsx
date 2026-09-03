import { Input } from '@/components/input'
import { Label } from '@/components/label'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Input</h1>
        <p className="text-sm text-muted-foreground">
          Campo de texto com suporte a erro/texto de ajuda: borda vermelha
          + mensagem vermelha quando há erro. Estende todos os atributos
          nativos de <code>&lt;input&gt;</code>. A prop opcional{' '}
          <code>mask="phone"</code> formata como você digita em
          (11) 99999-9999 e bloqueia caracteres que não sejam dígitos.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" placeholder="Nome do reparador" />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" placeholder="email@exemplo.com" error="Formato de email inválido" />
        </div>
        <div>
          <Label htmlFor="tel">Telefone</Label>
          <Input id="tel" mask="phone" placeholder="(11) 99999-9999" helperText="Opcional" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string  // ignorado se error estiver definido
  mask?: 'phone'        // formata (11) 99999-9999 conforme digita
}`}</pre>
      </div>
    </div>
  )
}
