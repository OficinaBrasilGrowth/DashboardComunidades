'use client'

// ARQUIVADO PRA FORA DO ESCOPO PÚBLICO DA V1 (Ago 2026) — decisão de
// escopo confirmada com o time a partir do relatório de smoke test
// manual ("Oficina Brasil DS — Correções para a v1"): não é componente
// core de UI, e a avaliação foi que não entrega o efeito de marca
// esperado hoje. Movido pra fora de components/ (que o script
// generate-exports.js varre automaticamente) especificamente pra sair
// dos exports públicos do pacote sem precisar mexer no gerador — ver
// CONSOLIDATION.md pro registro completo da decisão. Código preservado
// intacto, não apagado — pode voltar pós-v1 como projeto específico de
// design, se fizer sentido, numa futura área de Brand Assets.

// Logo cutout graphic element — brand guide p. 55-56.
// "Nosso principal grafismo é derivado de recortes do nosso logo...
// A forma de aplicar é livre, mas é fundamental que se tenha cautela:
// use-o com moderação... O recorte do logo deve ser usado em combinação
// com as cores da nossa paleta, criando um efeito duotone."
//
// Isso NÃO é o wordmark legível — são as mesmas formas de letra ampliadas
// dramaticamente e recortadas de perto, então só fragmentos abstratos das
// letras ficam visíveis. O guia diz explicitamente que a aplicação é livre,
// então a posição exata do recorte é uma escolha criativa, não uma
// especificação fixa.
//
// IMPORTANTE: isso usa o SVG real extraído do wordmark como background-image
// via CSS (ampliado via background-size, recortado via background-position)
// — não redesenha ou aproxima as formas das letras. Escolha `wordmarkAsset`
// combinando com um dos arquivos reais em assets/logo/ (ex:
// 'wordmark-azul.svg' ou 'wordmark-verde.svg').

interface LogoCutoutProps {
  baseColor: string
  /** Caminho pro SVG real extraído do wordmark, ex: '/assets/logo/wordmark-azul.svg' */
  wordmarkAsset: string
  /** Quão ampliado é o recorte, como porcentagem de background-size. Maior = mais abstrato. */
  zoomPercent?: number
  /** Onde o recorte fica centralizado, como background-position CSS. */
  focalPoint?: string
  className?: string
}

export function LogoCutout({
  baseColor,
  wordmarkAsset,
  zoomPercent = 320,
  focalPoint = '65% 40%',
  className,
}: LogoCutoutProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className ?? ''}`}
      style={{
        backgroundColor: baseColor,
        minHeight: '220px',
        backgroundImage: `url(${wordmarkAsset})`,
        backgroundSize: `${zoomPercent}%`,
        backgroundPosition: focalPoint,
        backgroundRepeat: 'no-repeat',
      }}
      role="img"
      aria-label="Elemento gráfico decorativo da marca Oficina Brasil"
    />
  )
}
