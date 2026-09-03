import { Avatar, type AvatarSize } from './avatar'

// Empilha avatares com sobreposição (borda branca separando cada um do
// próximo) e mostra um indicador "+N" quando há mais itens do que o
// limite visível — reaproveita o Avatar já existente pro "+N" (nome
// genérico "+N", sem imagem, cai automaticamente no fallback de iniciais
// que já é a string "+N").

export interface AvatarGroupItem {
  name: string
  src?: string
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[]
  max?: number
  size?: AvatarSize
}

export function AvatarGroup({ items, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = items.slice(0, max)
  const overflow = items.length - visible.length

  return (
    <div className="flex items-center" role="group" aria-label={`${items.length} pessoas`}>
      {visible.map((item, i) => (
        <div key={i} className="rounded-full ring-2 ring-[var(--background)]" style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <Avatar name={item.name} src={item.src} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div className="rounded-full ring-2 ring-[var(--background)]" style={{ marginLeft: -8 }}>
          <Avatar name={`+${overflow}`} size={size} />
        </div>
      )}
    </div>
  )
}
