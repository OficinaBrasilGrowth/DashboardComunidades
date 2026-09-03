'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from './navigation'
import { useEscapeKey } from '../../lib/use-escape-key'

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// Sidebar fixa no desktop, drawer com backdrop no mobile: abaixo do
// breakpoint `md` (768px), a sidebar vira um painel `fixed` fora da tela
// por padrão (`-translate-x-full`), revelado por um botão de menu que só
// existe nesse breakpoint. O breakpoint aqui é `md`, não o mais comum
// `sm`, porque em telas entre 640-768px a sidebar de 256px ainda deixaria
// pouco espaço de leitura confortável pro conteúdo (tokens, exemplos de
// código, tabelas).

export default function StyleGuideLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEscapeKey(mobileMenuOpen, () => setMobileMenuOpen(false))

  return (
    <div className="flex min-h-screen">
      {/* Botão de menu — só existe abaixo do breakpoint md */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen((o) => !o)}
        aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={mobileMenuOpen}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg border flex items-center justify-center bg-card"
        style={{ borderColor: 'var(--border)' }}
      >
        <span aria-hidden="true" style={{ fontSize: 18 }}>{mobileMenuOpen ? '×' : '☰'}</span>
      </button>

      {/* Backdrop — só aparece com o menu mobile aberto, fecha ao clicar */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ backgroundColor: 'var(--shadow-overlay-backdrop)' }}
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        />
      )}

      <aside
        className={cn(
          'w-64 border-r bg-card p-6 flex flex-col gap-6 fixed top-0 left-0 h-screen overflow-y-auto z-40',
          'transition-transform md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Link href="/style-guides" className="text-xl font-bold" onClick={() => setMobileMenuOpen(false)}>
          Oficina Brasil DS
        </Link>
        <nav className="flex flex-col gap-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block px-3 py-2 rounded-md text-sm transition-colors',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 md:ml-64 overflow-auto p-8 pt-20 md:pt-8 max-w-full">{children}</main>
    </div>
  )
}
