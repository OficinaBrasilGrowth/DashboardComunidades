import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do Slider (teclado
// nativo via input range) e do MultiSelect (seleção múltipla mantém o
// popover aberto, chips removíveis, e o bug real de Escape não fechar
// depois de clicar numa opção).

test.describe('Slider', () => {
  test('setas do teclado mudam o valor', async ({ page }) => {
    await page.goto('/style-guides/components/slider')
    const slider = page.locator('input[type=range]').first()
    await slider.focus()
    const before = await slider.inputValue()
    await page.keyboard.press('ArrowRight')
    const after = await slider.inputValue()
    expect(Number(after)).toBe(Number(before) + 1)
  })

  test('Home vai pro valor mínimo', async ({ page }) => {
    await page.goto('/style-guides/components/slider')
    const slider = page.locator('input[type=range]').first()
    await slider.focus()
    await page.keyboard.press('Home')
    await expect(slider).toHaveValue('0')
  })

  test('slider desabilitado não responde a teclado', async ({ page }) => {
    await page.goto('/style-guides/components/slider')
    const disabledSlider = page.locator('input[type=range][disabled]')
    await expect(disabledSlider).toBeDisabled()
  })
})

test.describe('MultiSelect', () => {
  // O gatilho é um <div role="combobox">, não <button> — necessário pra
  // permitir botões reais de remover chip aninhados validamente (um
  // <button> não pode conter outro <button> interativo em HTML válido).
  // Os testes abaixo usam `[role=combobox]` como seletor do gatilho,
  // que bate com a estrutura sem depender da tag específica.
  test('selecionar uma opção mantém o popover aberto (diferente do Select de valor único)', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await page.locator('[role=combobox]').click()
    await page.locator('[role=option]', { hasText: 'Rio de Janeiro' }).click()
    await expect(page.getByRole('listbox')).toBeVisible()
  })

  test('Escape fecha mesmo depois de clicar numa opção (regressão do bug real)', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await page.locator('[role=combobox]').click()
    await page.locator('[role=option]', { hasText: 'Rio de Janeiro' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).not.toBeVisible()
  })

  test('remover um chip direto do gatilho não abre o popover sem querer', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await page.click('[aria-label="Remover São Paulo"]')
    await expect(page.getByRole('listbox')).not.toBeVisible()
    await expect(page.locator('[aria-label="Remover São Paulo"]')).toHaveCount(0)
  })

  test('busca sem acento funciona igual ao BrandSelect', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    await page.locator('[role=combobox]').click()
    await page.fill('input[placeholder="Buscar..."]', 'sao')
    await expect(page.getByRole('option', { name: 'São Paulo' })).toBeVisible()
  })

  test('Tab a partir do gatilho alcança o botão de remover chip, e Enter remove de verdade', async ({ page }) => {
    // Achado real durante o teste desta própria correção: sem checar
    // e.target === e.currentTarget no handler de teclado do gatilho, o
    // keydown do botão de remover (um filho) propagava pro container
    // pai — que interceptava Enter incondicionalmente, suprimindo a
    // remoção via preventDefault() e abrindo o menu por engano no lugar.
    await page.goto('/style-guides/components/multi-select')
    const trigger = page.locator('[role=combobox]')
    await trigger.focus()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Remover São Paulo' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('[aria-label="Remover São Paulo"]')).toHaveCount(0)
    await expect(page.getByRole('listbox')).not.toBeVisible()
  })

  test('Enter no próprio gatilho (sem chip focado) continua abrindo o menu normalmente', async ({ page }) => {
    await page.goto('/style-guides/components/multi-select')
    const trigger = page.locator('[role=combobox]')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('listbox')).toBeVisible()
  })
})
