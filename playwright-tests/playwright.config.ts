import { defineConfig, devices } from '@playwright/test'
import path from 'path'

const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR || path.join(__dirname, 'playwright-report')

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['list'],
    ['html', { outputFolder: outputDir, open: 'never' }],
    ['json', { outputFile: path.join(outputDir, 'results.json') }],
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        executablePath: process.env.CHROMIUM_PATH || undefined,
      },
    },
  ],
})
