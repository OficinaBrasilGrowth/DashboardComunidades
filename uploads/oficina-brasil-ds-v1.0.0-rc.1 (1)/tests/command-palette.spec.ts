import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do CommandPalette:
// atalho global (Ctrl+K), foco automático no campo de busca, busca sem
// acento, execução via Enter, e confirmação de que o listener global
// continua ativo depois de fechar (diferente de todo outro componente do
// sistema, que só ouve teclado enquanto está aberto).

test.describe('CommandPalette', () => {
  test('fechada por padrão', async ({ page }) => {
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Ctrl+K abre a paleta e foca o campo de busca automaticamente', async ({ page }) => {
    // Esse teste não esperava networkidle antes de disparar o atalho —
    // em runs sob mais carga de recurso, o Ctrl+K podia disparar antes
    // da hidratação do React terminar de registrar o listener global,
    // corrompendo o resultado por fragilidade do teste, não bug real do
    // componente. Confirmado rodando 20x isolado: falhava ~10% das
    // vezes sem esperar networkidle; investigação mostrou "elemento não
    // encontrado" nos 5000ms inteiros de polling (não um atraso breve,
    // indicando que o listener simplesmente não tinha sido registrado
    // ainda quando o Ctrl+K foi disparado).
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('[data-command-palette-input]')).toBeFocused()
  })

  test('busca sem acento encontra comando com acento', async ({ page }) => {
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await page.keyboard.press('Control+k')
    await page.keyboard.type('configuracoes')
    await expect(page.getByText('Abrir configurações')).toBeVisible()
  })

  test('Enter executa o comando destacado e fecha a paleta', async ({ page }) => {
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await page.keyboard.press('Control+k')
    await page.keyboard.type('novo')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('Escape fecha a paleta', async ({ page }) => {
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('o atalho global continua ativo depois de fechar (reabre)', async ({ page }) => {
    await page.goto('/style-guides/components/command-palette', { waitUntil: 'networkidle' })
    await page.keyboard.press('Control+k')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
