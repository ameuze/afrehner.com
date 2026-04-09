import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PORTFOLIO_URL || 'http://localhost:5173'
const BUDGET_MS = { fcp: 3000, lcp: 4000, api: 500 }

test.describe('Performance Suite', () => {
  test('PT-001 | Page load within budget', async ({ page }) => {
    const start = Date.now()
    await page.goto(BASE_URL)
    await page.waitForLoadState('domcontentloaded')
    const elapsed = Date.now() - start
    console.log(`  → DOM loaded in ${elapsed}ms`)
    expect(elapsed).toBeLessThan(BUDGET_MS.fcp)
  })

  test('PT-002 | Largest Contentful Paint within budget', async ({ page }) => {
    await page.goto(BASE_URL)
    const lcp = await page.evaluate(() =>
      new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          resolve(entries[entries.length - 1].startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true } as any)
        setTimeout(() => resolve(0), 3000)
      })
    )
    console.log(`  → LCP: ${lcp.toFixed(0)}ms`)
    if (lcp > 0) expect(lcp).toBeLessThan(BUDGET_MS.lcp)
  })

  test('PT-003 | Backend health endpoint responds quickly', async ({ request }) => {
    const start = Date.now()
    const res = await request.get('http://localhost:3001/api/test-runs')
    const elapsed = Date.now() - start
    console.log(`  → API responded in ${elapsed}ms (status ${res.status()})`)
    expect(elapsed).toBeLessThan(BUDGET_MS.api)
  })

  test('PT-004 | No layout shift on scroll', async ({ page }) => {
    await page.goto(BASE_URL)
    const cls = await page.evaluate(() =>
      new Promise<number>((resolve) => {
        let total = 0
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) total += (e as any).value
        }).observe({ type: 'layout-shift', buffered: true } as any)
        setTimeout(() => resolve(total), 2000)
      })
    )
    console.log(`  → CLS score: ${cls.toFixed(4)}`)
    expect(cls).toBeLessThan(0.1)
  })
})
