import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do Checkbox (estado
// indeterminate via ref+DOM, não via atributo), RadioGroup (navegação
// nativa por seta entre radios do mesmo name, sem JS de teclado escrito à
// mão) e Switch (padrão WAI-ARIA "switch" via button, sem input nativo
// equivalente).

test.describe('Checkbox', () => {
  test('clicar marca o checkbox', async ({ page }) => {
    await page.goto('/style-guides/components/checkbox')
    const checkbox = page.locator('#ex1')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  })

  test('onChange recebe o valor booleano direto, não o evento', async ({ page }) => {
    // Se onChange ainda passasse o Event nativo pro setState<boolean> da
    // página de doc, o estado viraria um objeto Event (sempre "truthy") em
    // vez de true/false — o checkbox marcaria no primeiro clique e NUNCA
    // desmarcaria no segundo, já que qualquer Event é truthy. Clicar duas
    // vezes e confirmar que desmarca prova que o valor é o boolean real,
    // não só que "clicar muda alguma coisa".
    await page.goto('/style-guides/components/checkbox')
    const checkbox = page.locator('#ex1')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
  })

  test('estado indeterminate é uma propriedade do DOM, não um atributo', async ({ page }) => {
    await page.goto('/style-guides/components/checkbox')
    const isIndeterminate = await page.locator('#ex2').evaluate((el: HTMLInputElement) => el.indeterminate)
    expect(isIndeterminate).toBe(true)
  })

  test('checkbox desabilitado não pode ser marcado por clique', async ({ page }) => {
    await page.goto('/style-guides/components/checkbox')
    const checkbox = page.locator('#ex3')
    await expect(checkbox).toBeDisabled()
  })
})

test.describe('RadioGroup', () => {
  test('clicar numa opção seleciona ela e desmarca as outras', async ({ page }) => {
    await page.goto('/style-guides/components/radio-group')
    await page.click('#estado-demo-rj')
    await expect(page.locator('#estado-demo-rj')).toBeChecked()
    await expect(page.locator('#estado-demo-sp')).not.toBeChecked()
  })

  test('navegação por seta entre radios do mesmo grupo funciona nativamente', async ({ page }) => {
    await page.goto('/style-guides/components/radio-group')
    await page.locator('#estado-demo-rj').focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('#estado-demo-mg')).toBeChecked()
  })
})

test.describe('Switch', () => {
  test('clicar alterna aria-checked', async ({ page }) => {
    await page.goto('/style-guides/components/switch')
    const sw = page.locator('#ex1')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
    await sw.click()
    await expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  test('Space e Enter alternam o estado via teclado', async ({ page }) => {
    await page.goto('/style-guides/components/switch')
    const sw = page.locator('#ex1')
    await sw.focus()
    await page.keyboard.press('Space')
    await expect(sw).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Enter')
    await expect(sw).toHaveAttribute('aria-checked', 'false')
  })
})
