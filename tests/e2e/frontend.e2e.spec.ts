import { test, expect } from '@playwright/test'
import { cleanupTestPage, seedTestPage, type SeededTestPage } from '../helpers/seedPage'

test.describe('Frontend', () => {
  let testPage: SeededTestPage

  test.beforeAll(async () => {
    testPage = await seedTestPage()
  })

  test.afterAll(async () => {
    if (testPage) {
      await cleanupTestPage(testPage.id)
    }
  })

  test('renders a published CMS page', async ({ page }) => {
    await page.goto(`/de/${testPage.slug}`)

    await expect(page).toHaveTitle(new RegExp(testPage.title))

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText(testPage.title)
  })
})
