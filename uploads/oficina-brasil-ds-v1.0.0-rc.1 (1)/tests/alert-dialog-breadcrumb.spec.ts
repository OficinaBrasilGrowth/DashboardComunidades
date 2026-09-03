import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do AlertDialog (foco
// padrão no botão seguro "Cancelar", não fecha ao clicar fora) e do
// Breadcrumb (semântica de navegação, aria-current no item atual).

test.describe('AlertDialog', () => {
  test('foco padrão vai pro botão Cancelar, não pro Confirmar', async ({ page }) => {
    await page.goto('/style-guides/components/alert-dialog')
    await page.click('text=Excluir conta')
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeFocused()
  })

  test('usa role=alertdialog, não role=dialog genérico', async ({ page }) => {
    await page.goto('/style-guides/components/alert-dialog')
    await page.click('text=Excluir conta')
    await expect(page.getByRole('alertdialog')).toBeVisible()
  })

  test('NÃO fecha ao clicar fora (diferente do Modal genérico, de propósito)', async ({ page }) => {
    await page.goto('/style-guides/components/alert-dialog')
    await page.click('text=Excluir conta')
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.mouse.click(10, 10)
    await expect(page.getByRole('alertdialog')).toBeVisible()
  })

  test('Escape fecha (chama onCancel)', async ({ page }) => {
    await page.goto('/style-guides/components/alert-dialog')
    await page.click('text=Excluir conta')
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('alertdialog')).not.toBeVisible()
  })

  test('Tab cicla só entre Cancelar e Confirmar, não escapa pra página', async ({ page }) => {
    await page.goto('/style-guides/components/alert-dialog')
    await page.click('text=Excluir conta')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Excluir', exact: true })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeFocused()
  })
})

test.describe('Breadcrumb', () => {
  test('último item é marcado como página atual, não é um link', async ({ page }) => {
    await page.goto('/style-guides/components/breadcrumb')
    const current = page.locator('[aria-current="page"]')
    await expect(current).toHaveText('Usuários')
    const tag = await current.evaluate((el) => el.tagName)
    expect(tag).toBe('SPAN')
  })

  test('itens anteriores são links de verdade', async ({ page }) => {
    await page.goto('/style-guides/components/breadcrumb')
    await expect(page.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/')
    await expect(page.getByRole('link', { name: 'Configurações' })).toHaveAttribute('href', '/config')
  })
})
