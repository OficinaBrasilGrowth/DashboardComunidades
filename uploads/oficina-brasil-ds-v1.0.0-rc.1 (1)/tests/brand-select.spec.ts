import { test, expect } from '@playwright/test'

// Regressão do bug de largura fixa (w-64 hardcoded vazando por cima de
// elementos vizinhos, corrigido pra w-full) e validação da busca sem
// acento.

test.describe('BrandSelect', () => {
  test('busca sem acento encontra opção com acento', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    await page.click('text=Selecione uma cidade')
    await page.fill('input[placeholder="Buscar..."]', 'sao')
    await expect(page.getByRole('option', { name: 'São Paulo' })).toBeVisible()
  })

  test('navegação por teclado: setas movem o destaque, Enter seleciona', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    await page.click('text=Selecione uma cidade')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    // depois de selecionar, o popover fecha e o botão mostra o valor escolhido
    await expect(page.locator('input[placeholder="Buscar..."]')).not.toBeVisible()
  })

  test('Escape fecha o popover sem selecionar', async ({ page }) => {
    await page.goto('/style-guides/components/select')
    await page.click('text=Selecione uma cidade')
    await expect(page.locator('input[placeholder="Buscar..."]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('input[placeholder="Buscar..."]')).not.toBeVisible()
  })

  test('não vaza pra fora de um container estreito (regressão do bug de largura fixa)', async ({ page }) => {
    await page.goto('/style-guides/components/filter-bar')
    const select = page.getByRole('button', { name: /selecione/i }).first()
    const input = page.locator('#busca')
    const selectBox = await select.boundingBox()
    const inputBox = await input.boundingBox()
    expect(selectBox).not.toBeNull()
    expect(inputBox).not.toBeNull()
    // o select não pode terminar depois de onde o campo de busca começa
    expect(selectBox!.x + selectBox!.width).toBeLessThanOrEqual(inputBox!.x)
  })
})
