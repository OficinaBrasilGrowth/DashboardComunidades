import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do AvatarGroup
// (sobreposição real medida via bounding box, indicador de excedente) e
// do Accordion (modo single fecha as outras, allowMultiple mantém mais
// de uma aberta, aria-expanded correto).

test.describe('AvatarGroup', () => {
  test('mostra indicador de excedente quando há mais itens que o limite', async ({ page }) => {
    await page.goto('/style-guides/components/avatar-group')
    await expect(page.getByText('+2')).toBeVisible()
  })

  test('avatares visíveis se sobrepõem de verdade (não só lado a lado)', async ({ page }) => {
    await page.goto('/style-guides/components/avatar-group')
    const avatars = page.locator('[role=img]')
    const first = await avatars.nth(0).boundingBox()
    const second = await avatars.nth(1).boundingBox()
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    // se o segundo comeca antes do primeiro terminar, ha sobreposicao real
    expect(second!.x).toBeLessThan(first!.x + first!.width)
  })
})

test.describe('Accordion', () => {
  test('modo padrão: abrir uma seção fecha a outra que estava aberta', async ({ page }) => {
    await page.goto('/style-guides/components/accordion')
    await page.click('text=Como funciona o pagamento?')
    await expect(page.getByText('Aceita cartão e PIX.')).toBeVisible()

    await page.click('text=Posso cancelar quando quiser?')
    await expect(page.getByText('Sim, sem multa.')).toBeVisible()
    await expect(page.getByText('Aceita cartão e PIX.')).not.toBeVisible()
  })

  test('aria-expanded reflete o estado real', async ({ page }) => {
    await page.goto('/style-guides/components/accordion')
    const header = page.getByRole('button', { name: 'Tem período de teste?' })
    await expect(header).toHaveAttribute('aria-expanded', 'false')
    await header.click()
    await expect(header).toHaveAttribute('aria-expanded', 'true')
  })

  test('allowMultiple: duas seções ficam abertas ao mesmo tempo', async ({ page }) => {
    await page.goto('/style-guides/components/accordion')
    await page.click('text=Seção X')
    await page.click('text=Seção Y')
    await expect(page.getByText('Conteúdo X.')).toBeVisible()
    await expect(page.getByText('Conteúdo Y.')).toBeVisible()
  })
})
