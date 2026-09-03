import { test, expect } from '@playwright/test'

// Button/IconButton foram extraídos da repetição real de vários
// <button> crus já existentes no sistema, não construídos do zero.

test.describe('Button', () => {
  test('anel de foco aparece ao focar de verdade', async ({ page }) => {
    await page.goto('/style-guides/components/button')
    const btn = page.getByRole('button', { name: 'Primary', exact: true })
    await btn.focus()
    const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(shadow).not.toBe('none')
  })

  test('anel de foco do destructive é vermelho, não azul', async ({ page }) => {
    await page.goto('/style-guides/components/button')
    const btn = page.getByRole('button', { name: 'Destructive' })
    await btn.focus()
    const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(shadow).toContain('209, 67, 67')
  })

  test('botão desabilitado tem o atributo disabled real, não simulado', async ({ page }) => {
    await page.goto('/style-guides/components/button')
    await expect(page.getByRole('button', { name: 'Desabilitado' })).toBeDisabled()
  })

  test('loading mostra aria-busy e desabilita o botão', async ({ page }) => {
    await page.goto('/style-guides/components/button')
    await page.click('text=Clique pra carregar')
    const btn = page.locator('button[aria-busy="true"]')
    await expect(btn).toBeVisible()
    await expect(btn).toBeDisabled()
  })

  test('primary muda de cor sozinho entre light e dark (--primary)', async ({ page }) => {
    await page.goto('/style-guides/components/button')
    const btn = page.getByRole('button', { name: 'Primary', exact: true })
    const corLight = await btn.evaluate((el) => getComputedStyle(el).backgroundColor)
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    const corDark = await btn.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(corLight).not.toBe(corDark)
  })
})

test.describe('IconButton', () => {
  test('todos os botões têm aria-label — nenhum ícone sem nome acessível', async ({ page }) => {
    await page.goto('/style-guides/components/icon-button')
    const botoes = await page.locator('button').all()
    for (const btn of botoes) {
      const label = await btn.getAttribute('aria-label')
      expect(label).toBeTruthy()
    }
  })

  test('tamanhos crescem de verdade (sm < md < lg)', async ({ page }) => {
    await page.goto('/style-guides/components/icon-button')
    const sm = await page.getByRole('button', { name: 'Editar (pequeno)' }).boundingBox()
    const md = await page.getByRole('button', { name: 'Editar (médio)' }).boundingBox()
    const lg = await page.getByRole('button', { name: 'Editar (grande)' }).boundingBox()
    expect(sm!.width).toBeLessThan(md!.width)
    expect(md!.width).toBeLessThan(lg!.width)
  })
})
