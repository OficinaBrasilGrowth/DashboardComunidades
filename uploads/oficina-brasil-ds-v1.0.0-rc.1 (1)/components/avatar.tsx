'use client'

import { useEffect, useRef, useState } from 'react'

// Imagem com fallback pra iniciais quando não há src ou a imagem falha
// ao carregar.
//
// Condição de corrida de SSR/hidratação: pra uma imagem que falha MUITO
// rápido (ex: um 404 same-origin), o evento nativo de erro do navegador
// pode disparar ANTES do React terminar de hidratar e anexar o listener
// de onError. Resultado: o <img> quebrado ficava exibido pra sempre,
// nunca caindo pro fallback de iniciais, mesmo o navegador já sabendo
// que a imagem falhou (confirmável via img.complete === true e
// img.naturalWidth === 0). Corrigido checando esse estado direto no ref
// assim que o componente monta, além do onError continuar cobrindo
// falhas que aconteçam depois da hidratação (imagem lenta, por exemplo).

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
}

const sizeMap: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 48 }
const fontSizeMap: Record<AvatarSize, string> = { sm: '0.65rem', md: '0.8rem', lg: '1rem' }

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const px = sizeMap[size]
  const showImage = src && !imgFailed

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) {
      setImgFailed(true)
    }
  }, [src])

  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0 font-semibold overflow-hidden"
      style={{
        width: px,
        height: px,
        fontSize: fontSizeMap[size],
        backgroundColor: 'var(--muted)',
        color: 'var(--muted-foreground)',
      }}
      role="img"
      aria-label={name}
    >
      {showImage ? (
        <img
          ref={imgRef}
          src={src}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  )
}
