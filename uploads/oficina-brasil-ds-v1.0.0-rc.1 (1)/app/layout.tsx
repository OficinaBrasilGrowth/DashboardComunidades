import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// lang="pt-BR" — required pra passar na regra html-has-lang de
// acessibilidade.
//
// A fonte Figtree precisa de um mecanismo real de carregamento — só
// declarar font-family: 'Figtree' em CSS, sem @font-face nem next/font
// nem import do Google Fonts, renderiza em Liberation Sans (fallback do
// sistema), não Figtree.
//
// Usa next/font/local (não next/font/google) de propósito: o build deste
// ambiente não tem acesso a fonts.googleapis.com/fonts.gstatic.com — o
// arquivo real da fonte variável foi baixado do repositório oficial do
// Google Fonts no GitHub (github.com/google/fonts, mesmo arquivo que o
// Google Fonts serviria, licença OFL já presente em licenses/) e
// auto-hospedado em public/fonts/. next/font/local gera um nome de
// font-family interno ofuscado — por isso o CSS usa var(--font-figtree),
// não mais o literal 'Figtree'.
const figtree = localFont({
  src: '../public/fonts/Figtree-Variable.ttf',
  variable: '--font-figtree',
  weight: '300 900', // fonte variável, cobre toda a faixa de peso usada no projeto
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Oficina Brasil — Design System',
  description: 'Design system tokens, components, and style guide for Oficina Brasil.',
  icons: {
    icon: '/favicon/favicon-32x32.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={figtree.variable}>
      <body>{children}</body>
    </html>
  )
}
