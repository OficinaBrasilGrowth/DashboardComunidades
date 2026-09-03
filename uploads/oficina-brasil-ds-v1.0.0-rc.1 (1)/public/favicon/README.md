# Favicon / ícones de app — Oficina Brasil

Gerado a partir da marca compacta real "OF BR" (`assets/logo/compact/of-br-verde.svg`,
extraída do arquivo original do Illustrator), composta sobre um fundo
azulEscuro — uma combinação de contraste aprovada conforme contrast-rules.ts.

## Limitação conhecida

A 16×16px (o tamanho legado de aba de navegador), "OF BR" empilhado em duas
linhas é genuinamente difícil de ler — verificado renderizando em tamanho
real e ampliando pixel a pixel, não só suposto. 32×32 e maiores leem
claramente. Isso é uma limitação do nível de detalhe da marca nesse
tamanho, não um erro de geração — sinalizando em vez de esconder. Se isso
importar, a correção seria um glifo dedicado ultra-pequeno (ex: só "O" ou
um ícone simplificado), o que precisaria de input do design, não algo pra
inventar unilateralmente aqui.

## Arquivos

- `favicon.ico` — multi-resolução (16/32/48px), o formato clássico que navegadores ainda pedem
- `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` — PNGs avulsos
- `apple-touch-icon.png` (180×180) — ícone de tela inicial do iOS
- `android-chrome-192x192.png`, `android-chrome-512x512.png` — ícones Android/PWA
- `manifest.json` — manifesto de web app referenciando os ícones Android

## Uso no app Next.js real

O Next.js App Router pega o `app/favicon.ico` automaticamente se for
colocado lá. Pro resto, adicione ao `app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: '/favicon/favicon-32x32.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/manifest.json',
}
```
