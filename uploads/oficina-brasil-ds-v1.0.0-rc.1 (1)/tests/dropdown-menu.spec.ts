import { test, expect } from '@playwright/test'

// Converte o script manual usado na correção do bug de posicionamento: o
// container esticava a largura inteira dentro de um flex column (achado
// na própria página de documentação do componente), corrigido movendo o
// contexto de posicionamento pra um span aninhado.

test.describe('DropdownMenu', () => {
  test('abre com foco no primeiro item', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.getByRole('button', { name: 'Ações ▾' }).click()
    const firstItem = page.getByRole('menuitem').first()
    await expect(firstItem).toBeFocused()
  })

  test('setas navegam entre os itens', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    await page.getByRole('button', { name: 'Ações ▾' }).click()
    await page.keyboard.press('ArrowDown')
    const secondItem = page.getByRole('menuitem').nth(1)
    await expect(secondItem).toBeFocused()
  })

  test('Escape fecha e devolve o foco pro gatilho', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    const trigger = page.getByRole('button', { name: 'Ações ▾' })
    await trigger.click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('menu abre perto do gatilho, não esticado pelo flex column da página (regressão)', async ({ page }) => {
    await page.goto('/style-guides/components/dropdown-menu')
    const trigger = page.getByRole('button', { name: 'Ações ▾' })
    await trigger.click()
    const triggerBox = await trigger.boundingBox()
    const menuBox = await page.getByRole('menu').boundingBox()
    expect(triggerBox).not.toBeNull()
    expect(menuBox).not.toBeNull()
    // o menu deve estar a uma distância razoável do gatilho, não do outro lado da tela
    expect(Math.abs(menuBox!.x - triggerBox!.x)).toBeLessThan(250)
  })
})
