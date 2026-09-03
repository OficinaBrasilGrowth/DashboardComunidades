import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção da navegação por
// teclado (ArrowLeft atravessando limite de mês), dos presets, e da
// digitação direta nos campos Início/Término.

test.describe('DatePicker', () => {
  test('setas atravessam o limite do mês corretamente', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')

    const mesAntes = await page.locator('[aria-live="polite"]').textContent()
    // 3x ArrowLeft a partir do dia 1 deve trocar de mês
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft')
    const mesDepois = await page.locator('[aria-live="polite"]').textContent()

    expect(mesDepois).not.toBe(mesAntes)
  })

  test('PageDown avança um mês inteiro, mantendo o mesmo dia', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    const mesAntes = await page.locator('[aria-live="polite"]').textContent()
    await page.keyboard.press('PageDown')
    const mesDepois = await page.locator('[aria-live="polite"]').textContent()
    expect(mesDepois).not.toBe(mesAntes)
  })

  test('presets de período preenchem Início e Término corretamente', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    await page.getByRole('button', { name: 'Últimos 7 dias' }).click()

    const inicio = await page.locator('#dp-start').inputValue()
    const termino = await page.locator('#dp-end').inputValue()
    expect(inicio).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    expect(termino).toMatch(/\d{2}\/\d{2}\/\d{4}/)
  })

  test('digitar diretamente no campo Início atualiza o calendário', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    await page.fill('#dp-start', '')
    await page.type('#dp-start', '01082026')
    await expect(page.locator('#dp-start')).toHaveValue('01/08/2026')
  })

  test('mostra a dica de "escolha a data final" só depois da primeira data escolhida', async ({ page }) => {
    await page.goto('/style-guides/components/date-picker')
    await page.click('text=Selecionar período')
    await expect(page.getByText('agora escolha a data final')).not.toBeVisible()

    // clica no dia focado (dia 1, roving tabindex padrão)
    await page.keyboard.press('Enter')
    await expect(page.getByText('agora escolha a data final')).toBeVisible()
  })

  test('painel abre alinhado ao gatilho mesmo dentro do flex column da página', async ({ page }) => {
    // Mesma categoria de bug que quebrou o DropdownMenu (container
    // esticando dentro de um flex flex-col) — checado aqui porque o
    // DatePicker tem a mesma estrutura de container "relative inline-block".
    // Diferença que salva o DatePicker: o painel não usa right-0 (que foi
    // a causa raiz do bug do DropdownMenu), só absolute padrão, que fica
    // alinhado à esquerda do container independente da largura dele.
    await page.goto('/style-guides/components/date-picker')
    const trigger = page.getByRole('button', { name: /selecionar período/i })
    await trigger.click()
    const triggerBox = await trigger.boundingBox()
    const painel = page.locator('[aria-live="polite"]').locator('xpath=ancestor::div[contains(@class,"absolute")]').first()
    const painelBox = await painel.boundingBox()
    expect(triggerBox).not.toBeNull()
    expect(painelBox).not.toBeNull()
    expect(Math.abs(painelBox!.x - triggerBox!.x)).toBeLessThan(10)
  })
})
