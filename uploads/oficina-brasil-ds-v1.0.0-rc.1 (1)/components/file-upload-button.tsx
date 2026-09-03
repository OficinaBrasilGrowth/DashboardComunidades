'use client'

import { useRef, useState } from 'react'
import { VisuallyHiddenInput } from './visually-hidden-input'
import { UploadIcon, CheckIcon } from './icons'

// Botão-gatilho + input escondido, tipo/tamanho de arquivo validados
// antes de aceitar, mudança de estado visual quando um arquivo é
// selecionado. Reaproveita VisuallyHiddenInput em vez de duplicar a
// lógica de input escondido.

export interface FileUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMb?: number
  label?: string
}

export function FileUploadButton({
  onFileSelect,
  accept = 'image/*',
  maxSizeMb = 10,
  label = 'Adicionar imagem',
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Arquivo maior que ${maxSizeMb}MB`)
      setFileName(null)
      return
    }
    setError(null)
    setFileName(file.name)
    onFileSelect(file)
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center gap-2 w-fit transition-shadow"
        style={
          fileName
            ? { backgroundColor: 'var(--success-surface)', color: 'var(--success-surface-foreground)' }
            : { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', boxShadow: 'var(--shadow-button-primary)' }
        }
      >
        {fileName ? <CheckIcon size={14} /> : <UploadIcon size={15} />}
        {fileName ?? label}
      </button>
      {error && (
        <span className="text-xs" style={{ color: 'var(--destructive-text)' }}>{error}</span>
      )}
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label={label}
      />
    </div>
  )
}
