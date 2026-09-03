// Combinações de cor acessíveis — copiadas verbatim do guia de marca,
// GOB01-GuiaMarca-OficinaBrasil_rev1.pdf, página 48 ("Identidade Visual / Cores").
//
// O guia define dois níveis de aprovação por fundo:
//   'always'      — acessível em todos os tamanhos e pesos (ícone de check)
//   'large-only'  — acessível só em tamanhos grandes: Figtree Regular > 18pt
//                   ou Figtree Bold < 14pt (ícone de aviso)
//
// Essa é a própria validação de acessibilidade do time de marca, não um
// cálculo WCAG genérico — trate como autoritativo acima de qualquer taxa
// de contraste calculada independentemente.

export type BrandColorName = 'azul' | 'azulEscuro' | 'verde' | 'turquesa' | 'azulClaro' | 'branco'

interface ContrastRule {
  always: BrandColorName[]
  largeOnly: BrandColorName[]
}

export const contrastTable: Record<Exclude<BrandColorName, 'branco'>, ContrastRule> = {
  azul: {
    always: ['branco', 'verde', 'azulClaro'],
    largeOnly: ['turquesa'],
  },
  verde: {
    always: ['azul', 'azulEscuro'],
    largeOnly: [],
  },
  turquesa: {
    always: ['azulEscuro'],
    largeOnly: [],
  },
  azulEscuro: {
    always: ['verde', 'branco', 'azulClaro'],
    largeOnly: ['turquesa'],
  },
  azulClaro: {
    always: ['azul', 'azulEscuro'],
    largeOnly: [],
  },
}

/**
 * Checa se uma cor de texto é aprovada pra um determinado fundo, conforme
 * a própria tabela de acessibilidade do guia de marca (não um cálculo
 * genérico de contraste).
 */
export function isApprovedPairing(
  background: Exclude<BrandColorName, 'branco'>,
  foreground: BrandColorName,
  fontSize: 'large' | 'body' = 'body'
): boolean {
  const rule = contrastTable[background]
  if (rule.always.includes(foreground)) return true
  if (fontSize === 'large' && rule.largeOnly.includes(foreground)) return true
  return false
}

// Regra inegociável revelada pela própria tabela:
// Fundo Verde NUNCA combina com texto branco — só azul ou azulEscuro.
// Isso é o oposto do instinto comum (branco-sobre-cor pra botões), então
// componentes usando o fundo 'verde' precisam checar isso explicitamente.
