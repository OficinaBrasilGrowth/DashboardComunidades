// Tokens de design — Oficina Brasil
// Fonte: GOB01-GuiaMarca-OficinaBrasil_rev1.pdf, seção 4.2 (Cores), página 47.
// Todo valor hex abaixo é copiado verbatim do guia de marca — nada inventado.

export const colors = {
  azul: '#18328A',        // Cor primária da marca
  azulEscuro: '#00134E',  // Fundos institucionais, blocos escuros, títulos escuros
  verde: '#90F252',       // Cor de destaque do wordmark — uso comedido conforme o guia
  turquesa: '#00B7A4',    // Acento secundário — marcadores de seção, divisores
  azulClaro: '#DAF7EF',   // Fundo de tinta clara
} as const

// Escala de cinza neutro — uma tinta sutil de azulEscuro (#00134E)
// misturada em cada passo. Não está no guia de marca original (que só
// define as 5 cores de marca), validado visualmente contra componentes
// reais antes da adoção.
export const neutrals = {
  white: '#FFFFFF',
  gray50: '#F5F6FA',
  gray100: '#E9EBF3',
  gray200: '#D3D7E4',
  gray400: '#9198B0',
  gray600: '#565D78',
  gray900: '#1D2340',
} as const

// Cor de aviso — laranja quente, em vez do âmbar clássico ou de um
// terracota mais discreto. Fica mais perto do vermelho de erro
// (#D14343) na roda de cores do que as alternativas — vale reconferir
// qualquer tela onde estados de aviso e erro apareçam lado a lado.
export const semantics = {
  destructive: '#D14343',
  destructiveForeground: '#FFFFFF',
  warning: '#E8792A',
  warningForeground: '#FFFFFF',
} as const

// Tons claros de fundo pro componente Alert (warning/error). O guia de
// marca não define nenhum tom claro de aviso/erro — gerados como uma
// tinta sutil das cores semânticas já confirmadas, pra dar um fundo de
// alerta legível sem ser um bloco sólido laranja/vermelho ocupando a
// tela inteira.
export const semanticTints = {
  warningTint: '#FDF0E6',
  errorTint: '#FBEAEA',
  // Texto escurecido pra usar sobre os tints acima — a cor semântica
  // pura (warning/destructive) sobre o próprio tint mede 2.61:1 e
  // 3.93:1, abaixo do mínimo 4.5:1 de contraste. Essas versões
  // escurecidas (mesma tonalidade, ~70-90% do brilho original) foram
  // calculadas especificamente pra passar contraste como TEXTO sobre
  // os tints, não como cor de fundo/borda.
  warningTintForeground: '#A2551D',
  errorTintForeground: '#BC3C3C',
} as const

// Cores de dark mode. Cada uma tem uma primitiva registrada aqui
// especificamente pra existir um lugar central de referência, em vez de
// só valores soltos no CSS.
export const darkMode = {
  cardDark: '#122568',              // fundo de card/popover no dark mode — navy levemente mais claro que azulEscuro
  borderDark: '#233B62',            // borda/input no dark mode
  mutedForegroundDark: '#9AA1AC',   // texto secundário no dark mode
  statPositiveLight: '#008073',     // turquesa escurecida (StatComparison, light mode)
  statPositiveDark: '#4CA69D',      // turquesa escurecida pro dark mode — mesmo motivo, contraste contra --card escuro
  destructiveDark: '#DF7B7B',       // destructive clareado pro dark mode
  destructiveSubtleDark: '#3F1414', // vermelho escurecido em direção ao preto — fundo "subtle" do Alert no dark mode, a tinta clara do light mode ficaria deslocada visualmente
  // Texto branco em todos os contextos de superfície turquesa, não mais
  // azulEscuro. #00B7A4 original falhava com branco (2,53:1) —
  // escurecido pra permitir branco (4,60:1), calculado e confirmado.
  // Usado por --success-surface e --brand-turquesa-surface em globals.css.
  turquesaSurface: '#008476',
  // Mesmo padrão do destructiveSubtleDark acima, agora pros outros 3
  // status semânticos (success/warning/info). Cada valor calculado e
  // confirmado por contraste real, não estimado.
  successSubtleLight: '#E0F6F4',   // tinta clara de turquesa, pro Alert (light mode)
  successSubtleDark: '#002E29',    // turquesa escurecida em direção ao preto, pro Alert (dark mode)
  warningSubtleDark: '#3A1E0A',    // laranja escurecida em direção ao preto, pro Alert (dark mode)
  infoSubtleDark: '#060C22',       // azul escurecido em direção ao preto, pro Alert (dark mode)
} as const

// Usado em --chart-5 (globals.css) como o cinza mais escuro de gráfico.
// Não é nenhum dos neutrals.grayXXX acima (é um tom distinto), por isso
// precisa de entrada própria.
export const chartNeutral = '#5B6270' as const
