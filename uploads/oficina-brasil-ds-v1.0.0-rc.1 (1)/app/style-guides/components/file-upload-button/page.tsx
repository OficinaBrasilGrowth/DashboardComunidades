'use client'

import { FileUploadButton } from '@/components/file-upload-button'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">FileUploadButton</h1>
        <p className="text-sm text-muted-foreground">
          Botão-gatilho + input de arquivo escondido, com validação de
          tamanho/tipo. Reaproveita{' '}
          <a href="/style-guides/components/visually-hidden-input" className="underline">VisuallyHiddenInput</a>{' '}
          em vez de duplicar esse padrão.
        </p>
      </div>

      <FileUploadButton onFileSelect={() => {}} />

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface FileUploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string       // default 'image/*'
  maxSizeMb?: number    // default 10
  label?: string        // default 'Adicionar imagem'
}`}</pre>
      </div>
    </div>
  )
}
