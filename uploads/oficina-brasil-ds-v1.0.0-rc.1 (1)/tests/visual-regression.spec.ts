import { test, expect } from '@playwright/test'

// Teste de regressão visual — captura uma imagem de referência de cada
// página de documentação e compara pixel a pixel a cada rodada futura,
// falhando se algo mudar visualmente sem ninguém ter percebido. Cobre a
// dimensão visual que os testes funcionais (comportamento) e o axe-core
// (contraste/acessibilidade) não cobrem.
//
// Animações desligadas (`animations: 'disabled'`) — sem isso, o teste
// ficaria instável dependendo de exatamente qual frame de uma transição
// CSS foi capturado.
//
// LIMITAÇÃO CONHECIDA: a página do DatePicker foi excluída de propósito.
// Ela mostra o mês atual dinamicamente (ex: "agosto 2026", calculado a
// partir da data real do sistema) — a imagem de referência ficaria
// desatualizada em poucas semanas por um motivo que não tem nada a ver
// com bug visual real, gerando falso alarme toda vez que o mês virasse.
// Sinalizado aqui, não escondido — se o DatePicker precisar de proteção
// visual no futuro, a solução certa é mockar a data do sistema no teste,
// não incluir a página como está.

// LIMITAÇÃO CONHECIDA (2): as imagens de referência deste arquivo foram
// geradas no Chromium deste sandbox de desenvolvimento
// (/home/claude/.cache/puppeteer/chrome/...), não pelo
// `npx playwright install chromium` que o workflow do CI realmente usa —
// os dois podem ser builds ligeiramente diferentes do Chromium, com
// possíveis diferenças sutis de anti-aliasing/renderização de fonte. Isso
// significa que a primeira rodada real no GitHub Actions pode falhar por
// diferença de ambiente, não por bug de verdade — nesse caso, a ação
// certa é regenerar as imagens de referência RODANDO NO PRÓPRIO CI
// (`npx playwright test --update-snapshots` como job manual), não simplesmente
// aumentar a tolerância de novo. Sinalizado aqui porque não dá pra
// verificar isso sem acesso ao CI real.

const paginas = [
  '/style-guides',
  // '/style-guides/needs-review' removida — página interna, fora do escopo público da v1
  '/style-guides/components/accordion',
  '/style-guides/components/admin-page-header',
  '/style-guides/components/alert',
  '/style-guides/components/alert-dialog',
  '/style-guides/components/avatar',
  '/style-guides/components/avatar-group',
  '/style-guides/components/badge',
  '/style-guides/components/bar-chart',
  '/style-guides/components/breadcrumb',
  '/style-guides/components/button',
  '/style-guides/components/chart-card',
  '/style-guides/components/checkbox',
  '/style-guides/components/command-palette',
  '/style-guides/components/considerations',
  '/style-guides/components/copy-button',
  '/style-guides/components/data-table',
  // '/style-guides/components/date-picker' — excluída, ver comentário acima
  '/style-guides/components/dropdown-menu',
  '/style-guides/components/empty-state',
  '/style-guides/components/file-upload-button',
  '/style-guides/components/filter-bar',
  '/style-guides/components/info-tooltip',
  '/style-guides/components/icon-button',
  '/style-guides/components/input',
  '/style-guides/components/kpi-card',
  '/style-guides/components/label',
  '/style-guides/components/line-chart',
  // '/style-guides/components/logo-cutout' fora do escopo público —
  // componente arquivado, ver components/_archive/logo-cutout.tsx
  '/style-guides/components/modal',
  '/style-guides/components/multi-select',
  '/style-guides/components/pagination',
  '/style-guides/components/popover',
  '/style-guides/components/progress-bar',
  '/style-guides/components/progress-ring',
  '/style-guides/components/radio-group',
  '/style-guides/components/select',
  '/style-guides/components/skeleton',
  '/style-guides/components/slider',
  '/style-guides/components/stat-comparison',
  '/style-guides/components/switch',
  '/style-guides/components/tabs',
  '/style-guides/components/textarea',
  '/style-guides/components/toast',
  '/style-guides/components/tooltip',
  '/style-guides/components/tree-view',
  '/style-guides/components/visually-hidden-input',
]

for (const pagina of paginas) {
  test(`regressão visual: ${pagina}`, async ({ page }) => {
    await page.goto(pagina)
    await page.waitForLoadState('networkidle')
    // maxDiffPixelRatio calibrado com um bug real, não um palpite: uma
    // mudança de cor errada e visível (Badge "info" virando vermelho por
    // engano) moveu só 0.17% dos pixels da página inteira — a margem
    // original de 2% (0.02) era 12x mais permissiva do que o necessário
    // pra pegar isso, e o teste passou mesmo com o bug lá. Recalibrado
    // pra 0.05% (0.0005), abaixo do que um bug real de cor localizado
    // produz, mas ainda com folga suficiente pra variação normal de
    // anti-aliasing entre rodadas.
    await expect(page).toHaveScreenshot(`${pagina.replace(/\//g, '-').slice(1)}.png`, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.0005,
    })
  })
}
