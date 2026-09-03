import { test, expect } from '@playwright/test'

// Testes de regressão de interação — overlays, teclado, fechamento de
// popovers, e acessibilidade de gráficos. Cada bug corrigido vira um
// cenário automatizado aqui.

test.describe('overlays não ficam atrás de elementos fixed sem z-index', () => {
  test('DropdownMenu renderiza via portal em document.body, não na árvore original', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.click('button:has-text("Ações")')
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
    const parentTag = await menu.evaluate((el) => el.parentElement?.tagName)
    expect(parentTag).toBe('BODY')
  })

  test('DropdownMenu não fica coberto pela sidebar fixed', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.click('button:has-text("Ações")')
    await expect(page.getByRole('menu')).toBeVisible()
    const topoClicavel = await page.evaluate(() => {
      const menu = document.querySelector('[role="menu"]')!
      const box = menu.getBoundingClientRect()
      const el = document.elementFromPoint(box.left + 10, box.top + 10)
      return menu.contains(el)
    })
    expect(topoClicavel).toBe(true)
  })

  test('Popover renderiza via portal em document.body', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    await page.click('text=Abrir Popover')
    const dialog = page.getByRole('dialog').first()
    await expect(dialog).toBeVisible()
    const parentTag = await dialog.evaluate((el) => el.parentElement?.tagName)
    expect(parentTag).toBe('BODY')
  })

  test('InfoTooltip renderiza via portal em document.body', async ({ page }) => {
    await page.goto('/style-guides/components/info-tooltip')
    await page.getByRole('button', { name: 'Mais informações' }).first().focus()
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toBeVisible()
    const parentTag = await tooltip.evaluate((el) => el.parentElement?.tagName)
    expect(parentTag).toBe('BODY')
  })
})

test.describe('MultiSelect: Enter com menu fechado abre, não seleciona', () => {
  // Seletor [role="combobox"] — o gatilho do MultiSelect é um <div>, não
  // <button>, necessário pra permitir botões reais de remover chip
  // aninhados validamente.
  test('Enter com o menu fechado abre o menu', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const trigger = page.locator('[role="combobox"]').first()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('listbox')).toBeVisible()
  })

  test('Espaço com o menu fechado abre o menu', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const trigger = page.locator('[role="combobox"]').first()
    await trigger.focus()
    await page.keyboard.press(' ')
    await expect(page.getByRole('listbox')).toBeVisible()
  })
})

test.describe('MultiSelect limpa a busca em todos os fechamentos', () => {
  test('busca é limpa ao fechar por clique externo', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const trigger = page.locator('[role="combobox"]').first()
    await trigger.click()
    await page.fill('input[aria-label="Buscar"]', 'sao')
    await page.mouse.click(900, 650)
    await trigger.click()
    await expect(page.locator('input[aria-label="Buscar"]')).toHaveValue('')
  })
})

test.describe('Tooltip e InfoTooltip fecham com Esc', () => {
  test('Tooltip: Esc fecha e mantém o foco no gatilho', async ({ page }) => {
    await page.goto('/style-guides/components/tooltip')
    const trigger = page.getByRole('button', { name: 'Passe o mouse ou dê Tab' })
    await trigger.focus()
    await expect(page.getByRole('tooltip')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('tooltip')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('InfoTooltip: Esc fecha e mantém o foco no gatilho', async ({ page }) => {
    await page.goto('/style-guides/components/info-tooltip')
    const trigger = page.getByRole('button', { name: 'Mais informações' }).first()
    await trigger.focus()
    await expect(page.getByRole('tooltip')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('tooltip')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})

test.describe('gráficos têm alternativa acessível sem hover', () => {
  test('LineChart expõe uma tabela de dados associada', async ({ page }) => {
    await page.goto('/style-guides/components/line-chart')
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('BarChart expõe uma tabela de dados associada', async ({ page }) => {
    await page.goto('/style-guides/components/bar-chart')
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })
})

test.describe('DatePicker fecha ao clicar fora, descarta rascunho', () => {
  test('clicar fora fecha o calendário', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    await expect(page.locator('button[aria-pressed]').first()).toBeVisible()
    await page.mouse.click(20, 20)
    await expect(page.locator('button[aria-pressed]').first()).not.toBeVisible()
  })

  test('rascunho não aplicado é descartado ao clicar fora', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    await page.locator('button[aria-pressed]').nth(2).click()
    await page.mouse.click(20, 20)
    await page.click('text=Selecionar período')
    const algumMarcado = await page.evaluate(() =>
      [...document.querySelectorAll('button[aria-pressed]')].some((d) => d.getAttribute('aria-pressed') === 'true')
    )
    expect(algumMarcado).toBe(false)
  })

  test('Esc fecha e descarta o rascunho, devolvendo o foco ao gatilho', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    const trigger = page.getByRole('button', { name: 'Selecionar período' })
    await trigger.click()
    await page.locator('button[aria-pressed]').nth(2).click()
    await page.keyboard.press('Escape')
    await expect(page.locator('button[aria-pressed]').first()).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})

test.describe('FilterBar demo aplica a categoria selecionada de verdade', () => {
  test('escolher uma categoria cria o chip correspondente', async ({ page }) => {
    await page.goto('/style-guides/components/filter-bar')
    await expect(page.getByText('Categoria:')).not.toBeVisible()
    await page.click('button[aria-haspopup="listbox"]')
    await page.click('text=Marketing')
    await expect(page.getByText('Categoria: Marketing')).toBeVisible()
  })
})

test.describe('Style Guide responsivo em viewport mobile', () => {
  test.use({ viewport: { width: 375, height: 700 } })

  test('sidebar fica fora da tela por padrão, conteúdo ocupa a largura toda', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    const sidebarBox = await page.locator('aside').boundingBox()
    const mainBox = await page.locator('main').boundingBox()
    expect(sidebarBox!.x).toBeLessThan(0)
    expect(mainBox!.x).toBe(0)
  })

  test('botão de menu abre e fecha a sidebar como drawer', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    // A sidebar usa transition-transform — espera a transição CSS
    // terminar antes de checar a posição final, achado real ao rodar
    // (a primeira tentativa pegou um frame no meio da animação, x
    // intermediário como -41 em vez de 0 ou -256).
    await page.waitForTimeout(250)
    const sidebarAberta = await page.locator('aside').boundingBox()
    expect(sidebarAberta!.x).toBe(0)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(250)
    const sidebarFechada = await page.locator('aside').boundingBox()
    expect(sidebarFechada!.x).toBeLessThan(0)
  })

  test('DataTable rola horizontalmente em vez de cortar conteúdo', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    const overflowX = await page.evaluate(() => {
      const wrapper = document.querySelector('table')?.parentElement
      return wrapper ? getComputedStyle(wrapper).overflowX : null
    })
    expect(overflowX).toBe('auto')
  })
})

test.describe('nomenclatura do BrandSelect consistente', () => {
  test('título da página e item da sidebar usam o mesmo nome', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const titulo = await page.locator('h1').textContent()
    const sidebarAtivo = await page.locator('aside a[class*="bg-primary"]').textContent()
    expect(titulo).toBe(sidebarAtivo)
  })
})

test.describe('Badge warning com texto branco, unificado com as demais variantes', () => {
  test('Pendente usa texto branco sobre laranja escurecido', async ({ page }) => {
    await page.goto('/style-guides/components/badge')
    const badge = page.getByText('Pendente', { exact: true })
    const color = await badge.evaluate((el) => getComputedStyle(el).color)
    expect(color).toBe('rgb(255, 255, 255)')
  })
})

test.describe('texto branco em todos os contextos de superfície turquesa', () => {
  test('Badge success (turquesa) usa texto branco', async ({ page }) => {
    await page.goto('/style-guides/components/badge')
    const badge = page.getByText('Ativo', { exact: true })
    const color = await badge.evaluate((el) => getComputedStyle(el).color)
    expect(color).toBe('rgb(255, 255, 255)')
  })

  test('AdminPageHeader turquesa usa texto branco, incluindo o subtítulo', async ({ page }) => {
    await page.goto('/style-guides/components/admin-page-header')
    const subtitulo = page.locator('p', { hasText: 'Status das conexões' })
    await expect(subtitulo).toBeVisible()
    const color = await subtitulo.evaluate((el) => getComputedStyle(el).color)
    expect(color).toBe('rgb(255, 255, 255)')
  })
})
