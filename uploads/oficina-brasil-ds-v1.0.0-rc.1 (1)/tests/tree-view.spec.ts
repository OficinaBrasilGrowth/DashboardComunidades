import { test, expect } from '@playwright/test'

// Converte os scripts manuais usados na construção do TreeView — o padrão
// de teclado mais complexo do design system. Cobre os 5 cenários testados
// manualmente antes de considerar o componente pronto: pular filhos
// colapsados, expandir com seta direita, descer pro filho quando já
// aberto, descer múltiplos níveis, e subir de um neto pro pai com seta
// esquerda.

test.describe('TreeView', () => {
  test('ArrowDown num nó fechado pula pro próximo irmão, não entra nos filhos colapsados', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator(':focus')).toHaveText('Fotos')
  })

  test('ArrowRight expande um nó fechado', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('Contratos')).toBeVisible()
  })

  test('ArrowDown depois de expandir desce pro filho recém-visível', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    await expect(page.locator(':focus')).toHaveText('Contratos')
  })

  test('navegação desce múltiplos níveis (neto)', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('ArrowRight') // expande Documentos
    await page.keyboard.press('ArrowDown') // Contratos
    await page.keyboard.press('ArrowRight') // expande Contratos
    await page.keyboard.press('ArrowDown') // Contrato A
    await expect(page.locator(':focus')).toHaveText('Contrato A')
  })

  test('ArrowLeft numa folha sobe pro pai (não pro avô)', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowDown') // Contrato A (folha)
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator(':focus')).toHaveText('Contratos')
  })

  test('Home e End vão pro primeiro e último item visível', async ({ page }) => {
    await page.goto('/style-guides/components/tree-view')
    await page.locator('[role=treeitem]').first().focus()
    await page.keyboard.press('End')
    await expect(page.locator(':focus')).toHaveText('Fotos')
    await page.keyboard.press('Home')
    await expect(page.locator(':focus')).toHaveText('Documentos')
  })
})
