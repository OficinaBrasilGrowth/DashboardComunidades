import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do Popover (Escape via
// listener no document, já que o foco nunca entra no conteúdo — bug real
// achado no primeiro teste manual), do Tooltip (ativação por teclado, não
// só mouse) e do Avatar (fallback real quando a imagem falha).

test.describe('Popover', () => {
  test('abre ao clicar no gatilho', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    await page.click('text=Abrir Popover')
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('Escape fecha e devolve o foco pro gatilho (achado real: foco não entra no conteúdo)', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    const trigger = page.getByRole('button', { name: 'Abrir Popover' })
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('fecha ao clicar fora', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    await page.click('text=Abrir Popover')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.mouse.click(10, 500)
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})

test.describe('Tooltip', () => {
  test('aparece com foco de teclado, não só mouse', async ({ page }) => {
    await page.goto('/style-guides/components/tooltip')
    await page.locator('button', { hasText: 'Passe o mouse' }).focus()
    await expect(page.getByRole('tooltip')).toBeVisible()
  })

  test('some ao perder o foco', async ({ page }) => {
    await page.goto('/style-guides/components/tooltip')
    await page.locator('button', { hasText: 'Passe o mouse' }).focus()
    await expect(page.getByRole('tooltip')).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('tooltip')).not.toBeVisible()
  })
})

test.describe('Avatar', () => {
  test('mostra iniciais quando não há imagem', async ({ page }) => {
    await page.goto('/style-guides/components/avatar')
    await expect(page.getByText('MS')).toBeVisible()
  })

  test('mostra iniciais depois que a imagem falha de verdade ao carregar', async ({ page }) => {
    await page.goto('/style-guides/components/avatar')
    // espera o onError real disparar (URL inválida de propósito na página de doc)
    await expect(page.getByText('CS')).toBeVisible({ timeout: 10_000 })
  })
})
