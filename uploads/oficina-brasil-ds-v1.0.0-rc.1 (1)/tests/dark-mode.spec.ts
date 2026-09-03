import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Auditoria preventiva de contraste — texto hardcoded não se adaptando
// ao tema (ficando invisível em dark mode) é uma categoria de bug real
// e recorrente. Isso roda a MESMA checagem de contraste do axe-core
// usada em accessibility.spec.ts, mas com .dark aplicado — pegando
// qualquer novo componente que repita a categoria antes de alguém
// precisar notar visualmente.
//
// A classe é aplicada DEPOIS do carregamento (networkidle), não via
// addInitScript antes — achado real durante a construção deste teste: o
// layout raiz (app/layout.tsx) renderiza <html lang="pt-BR"> sem
// className, e o React reseta/reconcilia esse atributo durante a
// hidratação, removendo qualquer classe injetada antes disso. Confirmado
// isso empiricamente comparando os dois momentos: aplicar antes resultava
// em classList.contains('dark') === false depois do load; aplicar depois
// resulta em true e o tema realmente muda (fundo fica azul-marinho).

const paginasComComponentesDeCor = [
  '/style-guides',
  '/style-guides/components/admin-page-header',
  '/style-guides/components/alert',
  '/style-guides/components/badge',
  '/style-guides/components/chart-card',
  '/style-guides/components/checkbox',
  '/style-guides/components/considerations',
  '/style-guides/components/copy-button',
  '/style-guides/components/data-table',
  '/style-guides/components/date-picker',
  '/style-guides/components/dropdown-menu',
  '/style-guides/components/empty-state',
  '/style-guides/components/file-upload-button',
  '/style-guides/components/filter-bar',
  '/style-guides/components/info-tooltip',
  '/style-guides/components/input',
  '/style-guides/components/kpi-card',
  '/style-guides/components/label',
  '/style-guides/components/modal',
  '/style-guides/components/pagination',
  '/style-guides/components/progress-bar',
  '/style-guides/components/progress-ring',
  '/style-guides/components/radio-group',
  '/style-guides/components/select',
  '/style-guides/components/skeleton',
  '/style-guides/components/stat-comparison',
  '/style-guides/components/switch',
  '/style-guides/components/tabs',
  '/style-guides/components/textarea',
  '/style-guides/components/toast',
]

for (const pagina of paginasComComponentesDeCor) {
  test(`dark mode: sem violação de contraste em ${pagina}`, async ({ page }) => {
    await page.goto(pagina)
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze()
    // Filtra só color-contrast — outras regras (ex: landmarks) já são
    // cobertas pela suíte em modo claro e não mudam com o tema.
    const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast')
    expect(contrastViolations, JSON.stringify(contrastViolations, null, 2)).toEqual([])
  })
}

// O loop acima só testa cada página no estado FECHADO. O DropdownMenu
// só renderiza os itens do menu quando aberto ({open && (...)}) —
// então o axe-core nunca veria o texto dos itens em dark mode nesse
// loop, e um bug de contraste no estado aberto passaria despercebido.
// Este teste garante que a verificação específica do estado ABERTO
// exista separadamente.
test('dark mode: sem violação de contraste no DropdownMenu ABERTO (não só fechado)', async ({ page }) => {
  await page.goto('/style-guides/components/dropdown-menu')
  await page.evaluate(() => document.documentElement.classList.add('dark'))
  await page.click('button[aria-haspopup="menu"]')
  await expect(page.getByRole('menu')).toBeVisible()
  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze()
  const contrastViolations = results.violations.filter((v) => v.id === 'color-contrast')
  expect(contrastViolations, JSON.stringify(contrastViolations, null, 2)).toEqual([])
})
