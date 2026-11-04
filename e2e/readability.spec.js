import { test, expect } from '@playwright/test'

test.describe('Legibilidade e consistência visual', () => {
  test('página inicial: textos legíveis e sem rolagem horizontal', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/OnlyStudent/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const styles = await page.locator('body').evaluate(element => {
      const computed = window.getComputedStyle(element)
      return {
        fontSize: parseFloat(computed.fontSize),
        lineHeight: parseFloat(computed.lineHeight)
      }
    })

    expect(styles.fontSize).toBeGreaterThanOrEqual(16)
    expect(styles.lineHeight).toBeGreaterThanOrEqual(24)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })

  test('login: campos e botões têm alvos confortáveis', async ({ page }) => {
    await page.goto('/#/entrar')
    await expect(page.getByRole('heading', { name: 'Boas-vindas de volta.' })).toBeVisible()

    for (const field of ['E-mail', 'Senha']) {
      const input = page.getByLabel(field, { exact: true })
      await expect(input).toBeVisible()
      const dimension = await input.evaluate(element => {
        const bounds = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        return { height: bounds.height, size: parseFloat(styles.fontSize) }
      })
      expect(dimension.height).toBeGreaterThanOrEqual(44)
      expect(dimension.size).toBeGreaterThanOrEqual(16)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })

  test('menu de navegação acessível em largura de tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 })
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Alternar menu' })
    await expect(menu).toBeVisible()
    await menu.click()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('navigation').getByRole('button', { name: 'Criar conta' })).toBeVisible()
  })
})
