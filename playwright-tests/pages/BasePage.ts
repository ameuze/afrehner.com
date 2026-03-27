import type { Page } from '@playwright/test'

export abstract class BasePage {
  constructor(protected page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: false })
  }
}
