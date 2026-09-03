import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Auditoria automatizada de acessibilidade, com axe-core, rodando a cada
// mudança — não só validação manual pontual.

const paginas = [
  '/style-guides',
  // '/style-guides/needs-review' removida — página interna, fora do escopo público da v1
  '/style-guides/components/admin-page-header',
  '/style-guides/components/alert',
  '/style-guides/components/badge',
  '/style-guides/components/bar-chart',
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
  '/style-guides/components/line-chart',
  // '/style-guides/components/logo-cutout' fora do escopo público —
  // componente arquivado, ver components/_archive/logo-cutout.tsx
  '/style-guides/components/modal',
  '/style-guides/components/multi-select',
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
  '/style-guides/components/visually-hidden-input',
]

for (const pagina of paginas) {
  test(`sem violações WCAG 2 A/AA em ${pagina}`, async ({ page }) => {
    await page.goto(pagina)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}

// Popovers abertos escapam de uma checagem só na página em repouso —
// mesma lição da auditoria manual original (3 violações do BrandSelect só
// apareciam com o popover aberto).
test.describe('acessibilidade com popovers abertos', () => {
  test('Select aberto', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    await page.click('text=Selecione uma cidade')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('DatePicker aberto', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('Modal aberto', async ({ page }) => {
    await page.goto('/style-guides/components/modal')
    await page.click('text=Abrir modal')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  test('DropdownMenu aberto', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.click('text=Ações ▾')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })

  // Cobre os dois estados (fechado e aberto), como os outros popovers acima.
  test('MultiSelect aberto', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await page.click('[role="combobox"]')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
})
