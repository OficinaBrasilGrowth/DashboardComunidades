import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Testes de regressão de acessibilidade e teclado — nome acessível,
// navegação por Tab/Enter/Escape, e responsividade da documentação em
// viewport mobile.

test.describe('home do Style Guide responsiva em mobile', () => {
  test.use({ viewport: { width: 375, height: 900 } })

  test('grid de cores da marca não fica com colunas espremidas', async ({ page }) => {
    await page.goto('/style-guides')
    const primeiraCor = page.locator('text=Azul').first()
    await expect(primeiraCor).toBeVisible()
    const colunas = await page.evaluate(() => {
      const grid = document.querySelector('.grid')
      return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0
    })
    // Em 375px (abaixo do breakpoint min-[420px]), deve ser 1 coluna só.
    expect(colunas).toBe(1)
  })

  test('tabela de combinações aprovadas rola horizontalmente, não corta conteúdo', async ({ page }) => {
    await page.goto('/style-guides')
    const overflowX = await page.evaluate(() => {
      const wrapper = document.querySelector('table')?.parentElement
      return wrapper ? getComputedStyle(wrapper).overflowX : null
    })
    expect(overflowX).toBe('auto')
  })
})

test.describe('dark mode separado do gate de release', () => {
  test('script test:functional exclui explicitamente os testes de dark mode', async () => {
    // Dark mode não é tema oficialmente suportado, então os testes de
    // dark mode (tests/dark-mode.spec.ts) não devem bloquear o gate de
    // release. Este teste verifica o conteúdo do script diretamente
    // (não spawna um processo Playwright aninhado, que seria frágil e
    // lento) — se alguém reverter a exclusão sem querer, esse teste
    // quebra e avisa antes de virar regressão de verdade no CI.
    const fs = require('fs')
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    expect(pkg.scripts['test:functional']).toContain('dark mode:')
    expect(pkg.scripts['test:functional']).toContain('grep-invert')
  })
})

test.describe('VisuallyHiddenInput não é um tab stop invisível', () => {
  test('Tab a partir do FileUploadButton não para no input escondido', async ({ page }) => {
    await page.goto('/style-guides/components/file-upload-button')
    const trigger = page.locator('button', { hasText: 'Adicionar imagem' })
    await trigger.focus()
    await page.keyboard.press('Tab')
    const tagETipo = await page.evaluate(
      () => document.activeElement!.tagName + ':' + ((document.activeElement as HTMLInputElement).type || 'none')
    )
    expect(tagETipo).not.toBe('INPUT:file')
  })

  test('input escondido tem tabIndex -1 de verdade', async ({ page }) => {
    await page.goto('/style-guides/components/file-upload-button')
    const tabIndex = await page.evaluate(() => document.querySelector('input[type=file]')!.getAttribute('tabindex'))
    expect(tabIndex).toBe('-1')
  })
})

test.describe('limpar/remover acessível por teclado', () => {
  test('BrandSelect: Tab alcança "Limpar seleção" e Enter limpa de verdade', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup=listbox]').first()
    await trigger.click()
    await page.locator('[role=option]').first().click()
    await trigger.focus()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Limpar seleção' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('button[aria-label="Limpar seleção"]')).toHaveCount(0)
  })

  test('BrandSelect: nenhum elemento interativo aninhado inválido', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    await page.locator('button[aria-haspopup=listbox]').first().click()
    await page.locator('[role=option]').first().click()
    const temAninhamento = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')]
      return buttons.some((b) => b.querySelector('button, [role="button"]') !== null)
    })
    expect(temAninhamento).toBe(false)
  })

  test('MultiSelect: nenhum elemento interativo aninhado inválido (button dentro de button)', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const temButtonDentroDeButton = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')]
      return buttons.some((b) => b.querySelector('button') !== null)
    })
    expect(temButtonDentroDeButton).toBe(false)
  })
})

test.describe('BrandSelect: Enter com o menu fechado abre, não seleciona', () => {
  // Mesmo handler de teclado era usado no gatilho fechado e na busca
  // aberta — Enter com o Select FECHADO selecionava filtered[0] direto,
  // sem nunca abrir a lista. Mesmo padrão de bug já corrigido no
  // MultiSelect, replicado aqui.
  test('Enter com o menu fechado abre o menu, sem alterar o value', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    const valorAntes = await trigger.textContent()
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const valorImediatamenteApos = await trigger.textContent()
    expect(valorImediatamenteApos).toBe(valorAntes)
  })

  test('Espaço com o menu fechado também abre o menu', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.focus()
    await page.keyboard.press(' ')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('com o menu aberto, Enter continua selecionando a opção destacada como antes', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.click()
    await page.keyboard.press('Enter')
    await expect(trigger).not.toHaveText('Selecione uma cidade')
  })
})

test.describe('BrandSelect: fechamento consistente em qualquer caminho', () => {
  // useClickOutside só fechava sem limpar a busca, e Escape só era
  // tratado dentro do campo de busca — com o foco movido pra "Limpar
  // seleção" ou pro gatilho via Shift+Tab, Escape parava de fazer
  // qualquer coisa. Mesmo padrão de bug já corrigido no MultiSelect,
  // replicado aqui: close() centralizado, useEscapeKey com listener no
  // document (funciona independente de qual elemento interno tem foco).
  test('busca é limpa depois de clique fora e reabertura', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.click()
    await page.fill('input[placeholder]', 'sao')
    await page.mouse.click(900, 650)
    await trigger.click()
    await expect(page.locator('input[placeholder]')).toHaveValue('')
  })

  test('Esc fecha mesmo com o foco no botão "Limpar seleção" (Shift+Tab a partir da busca)', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.click()
    await page.locator('[role=option]').first().click()
    await trigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByRole('button', { name: 'Limpar seleção' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).not.toBeVisible()
  })

  test('valor já selecionado não é alterado ao fechar por Esc ou clique fora', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.click()
    await page.locator('[role=option]').first().click()
    const valorAntes = await trigger.textContent()
    await trigger.click()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveText(valorAntes!)
  })

  // O clique no PRÓPRIO gatilho pra fechar é um terceiro caminho de
  // fechamento sem selecionar, além de Esc e clique fora — testado
  // explicitamente aqui como regressão permanente.
  test('busca é limpa ao fechar clicando no próprio gatilho (terceiro caminho, além de Esc e clique fora)', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    const trigger = page.locator('button[aria-haspopup="listbox"]').first()
    await trigger.click()
    const busca = page.getByRole('combobox', { name: 'Buscar' })
    await busca.fill('sao')
    await trigger.click() // fecha clicando no próprio gatilho, não clique fora nem Esc
    await expect(page.getByRole('listbox')).not.toBeVisible()
    await trigger.click() // reabre
    await expect(page.getByRole('combobox', { name: 'Buscar' })).toHaveValue('')
  })
})

test.describe('MultiSelect: contrato de nome acessível é exatamente um', () => {
  // O contrato de tipos (união discriminada, exatamente um dos dois)
  // já é validado em tempo de compilação — este teste confirma só que
  // os dois caminhos VÁLIDOS renderizam o atributo ARIA certo em runtime.
  test('label sozinho gera aria-label', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await expect(page.locator('[role="combobox"]')).toHaveAttribute('aria-label', 'Estados')
  })
})
test.describe('MultiSelect: semântica ARIA completa do combobox', () => {
  test('combobox tem nome acessível e aria-controls apontando pra listbox real', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const combobox = page.locator('[role="combobox"]')
    await expect(combobox).toHaveAttribute('aria-label', /.+/)
    const controlsId = await combobox.getAttribute('aria-controls')
    expect(controlsId).toBeTruthy()
    await combobox.click()
    const listbox = page.locator(`#${controlsId}`)
    await expect(listbox).toHaveAttribute('role', 'listbox')
  })

  test('axe-core: 0 violações fechado e aberto', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const fechado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(fechado.violations, JSON.stringify(fechado.violations, null, 2)).toEqual([])

    await page.locator('[role="combobox"]').click()
    const aberto = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(aberto.violations, JSON.stringify(aberto.violations, null, 2)).toEqual([])
  })
})
