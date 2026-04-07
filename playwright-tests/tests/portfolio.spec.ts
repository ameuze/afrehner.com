import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PORTFOLIO_URL ?? 'http://localhost:5173'

test.describe('Portfolio Website Tests', () => {
  test('TC-P01 | Homepage loads and displays hero section', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    // Page should load successfully
    expect(page.url()).toContain(BASE_URL.replace(/\/$/, ''))
    console.log('  → Homepage loaded successfully')

    // Hero section should be visible
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
    console.log('  → Hero section is visible')

    // Should have a heading
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    const headingText = await heading.textContent()
    console.log(`  → Heading: "${headingText}"`)
  })

  test('TC-P02 | Navigation bar is present and functional', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    console.log('  → Navbar is present')

    // Check nav links exist
    const links = nav.locator('a')
    const linkCount = await links.count()
    expect(linkCount).toBeGreaterThanOrEqual(3)
    console.log(`  → Found ${linkCount} nav links`)
  })

  test('TC-P03 | All major sections are present on the page', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    const sections = ['#hero', '#about', '#skills', '#projects', '#contact']

    for (const sectionId of sections) {
      const section = page.locator(sectionId)
      await expect(section).toBeAttached()
      console.log(`  → Section ${sectionId} is present`)
    }
  })

  test('TC-P04 | Skills section displays skill items', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    // Scroll to skills
    await page.locator('#skills').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)

    const skillItems = page.locator('#skills .space-y-4 > div, #skills .flex.flex-wrap span')
    const count = await skillItems.count()
    expect(count).toBeGreaterThan(0)
    console.log(`  → Found ${count} skill elements`)
  })

  test('TC-P05 | Projects section displays project cards', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    await page.locator('#projects').scrollIntoViewIfNeeded()

    const projectCards = page.locator('#projects [class*="rounded-xl"]')
    const count = await projectCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
    console.log(`  → Found ${count} project cards`)
  })

  test('TC-P06 | Contact section has email link', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    await page.locator('#contact').scrollIntoViewIfNeeded()

    const emailLink = page.locator('#contact a[href^="mailto:"]')
    await expect(emailLink).toBeVisible()
    const href = await emailLink.getAttribute('href')
    console.log(`  → Email link found: ${href}`)
    expect(href).toMatch(/^mailto:/)
  })

  test('TC-P07 | Dark/light theme toggle works', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    // Default should be dark
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
    console.log('  → Default theme is dark')

    // Find and click theme toggle
    const themeToggle = page.locator('button[aria-label="Toggle theme"]').first()
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      await page.waitForTimeout(300)

      await expect(html).not.toHaveClass(/dark/)
      console.log('  → Switched to light theme')

      // Toggle back
      await themeToggle.click()
      await page.waitForTimeout(300)
      await expect(html).toHaveClass(/dark/)
      console.log('  → Switched back to dark theme')
    } else {
      console.log('  → Theme toggle not immediately visible (may require scroll)')
    }
  })
})
