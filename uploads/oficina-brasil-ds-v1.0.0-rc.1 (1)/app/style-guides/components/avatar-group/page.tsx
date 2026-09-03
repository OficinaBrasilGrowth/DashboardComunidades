import { AvatarGroup } from '@/components/avatar-group'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">AvatarGroup</h1>
        <p className="text-sm text-muted-foreground">
          Empilha avatares com sobreposição (anel na cor de fundo separando
          cada um do próximo) e mostra um indicador "+N" quando há mais
          itens do que o limite visível — reaproveita o{' '}
          <a href="/style-guides/components/avatar" className="underline">Avatar</a>{' '}
          já existente pro "+N" (nome genérico, sem imagem, cai
          automaticamente no fallback de iniciais que já é a própria
          string "+N").
        </p>
      </div>

      <AvatarGroup
        items={[
          { name: 'Maria Silva' },
          { name: 'João Pedro' },
          { name: 'Ana' },
          { name: 'Carlos Souza' },
          { name: 'Pedro Lima' },
          { name: 'Julia Santos' },
        ]}
        max={4}
      />

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AvatarGroupItem {
  name: string
  src?: string
}

interface AvatarGroupProps {
  items: AvatarGroupItem[]
  max?: number               // padrão 4
  size?: 'sm' | 'md' | 'lg'  // padrão 'md'
}`}</pre>
      </div>
    </div>
  )
}
