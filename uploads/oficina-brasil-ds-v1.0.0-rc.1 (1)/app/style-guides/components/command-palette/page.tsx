'use client'

import { CommandPalette } from '@/components/command-palette'

export default function Page() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">CommandPalette</h1>
        <p className="text-sm text-muted-foreground">
          Padrão "command palette" (Ctrl+K / Cmd+K) popularizado por
          ferramentas como VS Code e Linear. Reaproveita 3 peças já
          testadas do resto do design system:{' '}
          <code>useFocusTrap</code> (Modal/AlertDialog),{' '}
          <code>useEscapeKey</code> (Popover/MultiSelect),{' '}
          <code>normalizeText</code> (busca sem acento, BrandSelect/MultiSelect).
        </p>
      </div>

      <div className="rounded-lg border p-4 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        Pressione <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Ctrl</kbd> +{' '}
        <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>K</kbd> (ou{' '}
        <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>Cmd</kbd> +{' '}
        <kbd className="px-1.5 py-0.5 rounded border text-xs" style={{ borderColor: 'var(--border)' }}>K</kbd> no Mac)
        em qualquer lugar desta página pra abrir.
      </div>

      <CommandPalette
        commands={[
          { key: 'novo', label: 'Criar novo projeto', onSelect: () => {} },
          { key: 'config', label: 'Abrir configurações', onSelect: () => {}, shortcut: 'Ctrl+,' },
          { key: 'sair', label: 'Sair da conta', onSelect: () => {} },
        ]}
      />

      <div className="text-xs text-muted-foreground border-l-4 border-amber-400 pl-4">
        O listener do atalho global precisa existir mesmo com a paleta{' '}
        <strong>fechada</strong> — diferente de todo outro componente do
        sistema, que só ouve teclado enquanto está aberto.{' '}
        <code>preventDefault()</code> é necessário porque Ctrl+K é um
        atalho nativo do navegador em alguns casos.
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Props</p>
        <pre tabIndex={0} className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">{`interface CommandPaletteItem {
  key: string
  label: string
  onSelect: () => void
  shortcut?: string
}

interface CommandPaletteProps {
  commands: CommandPaletteItem[]
}`}</pre>
      </div>
    </div>
  )
}
