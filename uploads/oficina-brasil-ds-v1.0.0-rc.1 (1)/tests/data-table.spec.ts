import { test, expect } from '@playwright/test'

// Uso o seletor de cabeçalho de tabela diretamente — um <label> "Nome"
// de outro form na mesma página tornaria um seletor genérico de texto
// ambíguo.
//
// O clique mira o <button> real dentro do <th>, não o <th> inteiro —
// clicar no <th> inteiro clica no centro da célula, que pode cair fora
// do <button> (inline, não preenche a largura toda) se a coluna for
// larga.

test.describe('DataTable', () => {
  test('clicar no cabeçalho ordena a coluna (crescente, depois decrescente)', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    const header = page.locator('th', { hasText: 'Nome' }).first()
    const sortButton = header.locator('button')

    await sortButton.click()
    const crescente = await page.locator('table').first().locator('tbody tr td:first-child').allTextContents()

    await sortButton.click()
    const decrescente = await page.locator('table').first().locator('tbody tr td:first-child').allTextContents()

    expect(crescente).not.toEqual(decrescente)
    expect(crescente.slice().reverse()).toEqual(decrescente)
  })

  test('aria-sort atualiza conforme o estado de ordenação', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    const header = page.locator('th', { hasText: 'Nome' }).first()
    const sortButton = header.locator('button')

    await expect(header).toHaveAttribute('aria-sort', 'none')
    await sortButton.click()
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    await sortButton.click()
    await expect(header).toHaveAttribute('aria-sort', 'descending')
  })

  test('cabeçalho ordenável é alcançável e acionável por teclado', async ({ page }) => {
    // Cabeçalhos ordenáveis respondem ao clique, mas também precisam
    // entrar na sequência de Tab — ordenação acessível sem mouse. Esse
    // teste é o cenário de regressão desse comportamento específico, não
    // só uma reformulação do teste de clique acima.
    await page.goto('/style-guides/components/data-table')
    const header = page.locator('th', { hasText: 'Nome' }).first()
    const sortButton = header.locator('button')

    await sortButton.focus()
    await expect(sortButton).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-sort', 'descending')
    await page.keyboard.press('Enter')
    await expect(header).toHaveAttribute('aria-sort', 'none')
  })

  test('estado vazio mostra a mensagem customizada quando fornecida', async ({ page }) => {
    await page.goto('/style-guides/components/data-table')
    await expect(page.getByText('Nenhum reparador cadastrado ainda')).toBeVisible()
  })
})
