import { Avatar } from '@/components/avatar'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Avatar</h1>
        <p className="text-sm text-muted-foreground">
          Imagem com fallback pra iniciais quando não há <code>src</code>{' '}
          ou a imagem falha ao carregar. O avatar "Carlos Souza" abaixo usa
          uma URL que sempre retorna 404, de propósito: pra uma falha{' '}
          <em>muito rápida</em> (como um 404 same-origin), o evento nativo
          de erro do navegador pode disparar antes do React terminar de
          hidratar e anexar o <code>onError</code> — uma condição de
          corrida de SSR. Corrigido checando o estado real da imagem
          direto no <code>ref</code> assim que o componente monta, não só
          confiando no <code>onError</code>.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Avatar name="Maria Silva" size="sm" />
        <Avatar name="João Pedro" size="md" />
        <Avatar name="Ana" size="lg" />
        <Avatar name="Carlos Souza" src="/avatar-exemplo-que-nao-existe.jpg" />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface AvatarProps {
  src?: string
  name: string          // usado pro fallback de iniciais e pro aria-label
  size?: 'sm' | 'md' | 'lg'  // padrão 'md'
}`}</pre>
      </div>
    </div>
  )
}
