import { IconButton } from '@/components/icon-button'
import { EditIcon, TrashIcon, SearchIcon } from '@/components/icons'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">IconButton</h1>
        <p className="text-sm text-muted-foreground">
          Variante circular do <a href="/style-guides/components/button" className="underline">Button</a>,
          só ícone — extraída dos 11 usos de <code>rounded-full</code> já
          catalogados nos botões existentes (fechar do Modal, gatilho do
          DropdownMenu, etc.). <code>aria-label</code> é{' '}
          <strong>obrigatório</strong> no tipo, não opcional — um botão só
          de ícone sem nome acessível é uma violação real, não uma
          escolha de API.
        </p>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Variantes</p>
        <div className="flex flex-wrap gap-3">
          <IconButton variant="primary" icon={<EditIcon size={16} />} aria-label="Editar" />
          <IconButton variant="secondary" icon={<EditIcon size={16} />} aria-label="Editar" />
          <IconButton variant="outline" icon={<SearchIcon size={16} />} aria-label="Buscar" />
          <IconButton variant="ghost" icon={<SearchIcon size={16} />} aria-label="Buscar" />
          <IconButton variant="destructive" icon={<TrashIcon size={16} />} aria-label="Excluir" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Tamanhos</p>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton size="sm" icon={<EditIcon size={14} />} aria-label="Editar (pequeno)" />
          <IconButton size="md" icon={<EditIcon size={16} />} aria-label="Editar (médio)" />
          <IconButton size="lg" icon={<EditIcon size={18} />} aria-label="Editar (grande)" />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Desabilitado</p>
        <IconButton icon={<TrashIcon size={16} />} aria-label="Excluir" disabled />
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'  // padrão 'ghost'
  size?: 'sm' | 'md' | 'lg'  // padrão 'md'
  icon: ReactNode
  'aria-label': string  // obrigatório, não opcional
}`}</pre>
      </div>
    </div>
  )
}
