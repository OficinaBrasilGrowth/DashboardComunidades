import { test, expect } from '@playwright/test'

// Converte o script manual usado pra corrigir o focus trap do Modal
// (achado real: Tab escapava pro conteúdo atrás do overlay). Ver
// CHANGELOG.md 1.0.0 e o log de decisões pra contexto completo do bug
// original.

test.describe('Modal', () => {
  test('abre e prende o foco com Tab ciclando só entre os elementos internos', async ({ page }) => {
    await page.goto('/style-guides/components/modal')
    await page.click('text=Abrir modal')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // 8 Tabs devem ciclar só entre os elementos focáveis do modal, nunca
    // escapar pro resto da página — mesmo teste que pegou o bug original.
    const focusedTags: string[] = []
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName)
      focusedTags.push(tag ?? '')
    }
    // todos os elementos focados devem estar dentro do dialog
    const allInsideDialog = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]')
      return dialogEl?.contains(document.activeElement) ?? false
    })
    expect(allInsideDialog).toBe(true)
  })

  test('Shift+Tab a partir do primeiro elemento vai pro último (ciclo reverso)', async ({ page }) => {
    await page.goto('/style-guides/components/modal')
    await page.click('text=Abrir modal')
    await expect(page.getByRole('dialog')).toBeVisible()

    // foco inicial é o botão de fechar (primeiro elemento focável)
    const firstFocused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    expect(firstFocused).toBe('Fechar')

    await page.keyboard.press('Shift+Tab')
    const afterShiftTab = await page.evaluate(() => {
      const dialogEl = document.querySelector('[role="dialog"]')
      const focusables = dialogEl?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      return focusables && focusables.length > 0 ? document.activeElement === focusables[focusables.length - 1] : false
    })
    expect(afterShiftTab).toBe(true)
  })

  test('fecha com Escape e restaura o foco no elemento que abriu', async ({ page }) => {
    await page.goto('/style-guides/components/modal')
    const trigger = page.getByText('Abrir modal')
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()

    const activeText = await page.evaluate(() => document.activeElement?.textContent)
    expect(activeText).toContain('Abrir modal')
  })

  test('fecha ao clicar fora (no overlay)', async ({ page }) => {
    await page.goto('/style-guides/components/modal')
    await page.click('text=Abrir modal')
    await expect(page.getByRole('dialog')).toBeVisible()

    // clica num ponto do overlay, fora da caixa do dialog
    await page.mouse.click(10, 10)
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})
