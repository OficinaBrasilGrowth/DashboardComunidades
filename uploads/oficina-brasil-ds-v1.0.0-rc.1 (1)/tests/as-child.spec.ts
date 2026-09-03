import { test, expect } from '@playwright/test'

// Padrão asChild: sem isso, passar um <button> como trigger gera
// <button><button>...</button></button>, interação aninhada inválida.

test.describe('asChild — Popover', () => {
  test('sem asChild, o trigger continua envolvido num <button> próprio (compatibilidade preservada)', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    const trigger = page.getByRole('button', { name: 'Abrir Popover' })
    await expect(trigger).toBeVisible()
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('com asChild, o Button real vira o próprio gatilho, sem button aninhado', async ({ page }) => {
    await page.goto('/style-guides/components/popover')
    const temButtonAninhado = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')]
      return buttons.some((b) => b.querySelector('button') !== null)
    })
    expect(temButtonAninhado).toBe(false)

    await page.getByRole('button', { name: 'Abrir (Button real)' }).click()
    await expect(page.getByText('Sem nenhum botão aninhado')).toBeVisible()
  })
})

test.describe('asChild — DropdownMenu', () => {
  test('sem asChild, o trigger continua envolvido num <button> próprio (compatibilidade preservada)', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.getByRole('button', { name: 'Ações ▾' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
  })

  test('com asChild, nenhum <button> fica aninhado dentro de outro', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    const temButtonAninhado = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('button')]
      return buttons.some((b) => b.querySelector('button') !== null)
    })
    expect(temButtonAninhado).toBe(false)
  })

  test('com asChild, clicar no Button real abre o menu e foca o primeiro item', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.getByRole('button', { name: 'Ações (Button real) ▾' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Editar' })).toBeFocused()
  })
})
