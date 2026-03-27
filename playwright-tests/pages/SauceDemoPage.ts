import { expect, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly url = 'https://www.saucedemo.com'

  async navigate() {
    await this.page.goto(this.url)
    await this.waitForPageLoad()
  }

  async login(username: string, password: string) {
    await this.page.fill('[data-test="username"]', username)
    await this.page.fill('[data-test="password"]', password)
    await this.page.click('[data-test="login-button"]')
  }

  async expectLoginError(message: string) {
    await expect(this.page.locator('[data-test="error"]')).toContainText(message)
  }
}

export class InventoryPage extends BasePage {
  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/)
    await expect(this.page.locator('.inventory_list')).toBeVisible()
  }

  async getItemCount(): Promise<number> {
    return this.page.locator('.inventory_item').count()
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName })
    await item.locator('button[data-test^="add-to-cart"]').click()
  }

  async getCartBadgeCount(): Promise<string> {
    return this.page.locator('.shopping_cart_badge').textContent() ?? '0'
  }

  async goToCart() {
    await this.page.click('.shopping_cart_link')
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.selectOption('[data-test="product-sort-container"]', option)
  }

  async getFirstItemName(): Promise<string> {
    return (await this.page.locator('.inventory_item_name').first().textContent()) ?? ''
  }
}

export class CartPage extends BasePage {
  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/)
  }

  async getCartItems(): Promise<string[]> {
    return this.page.locator('.cart_item .inventory_item_name').allTextContents()
  }

  async proceedToCheckout() {
    await this.page.click('[data-test="checkout"]')
  }

  async removeItem(itemName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: itemName })
    await item.locator('button[data-test^="remove"]').click()
  }
}

export class CheckoutPage extends BasePage {
  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.fill('[data-test="firstName"]', firstName)
    await this.page.fill('[data-test="lastName"]', lastName)
    await this.page.fill('[data-test="postalCode"]', postalCode)
    await this.page.click('[data-test="continue"]')
  }

  async expectOverviewLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two/)
    await expect(this.page.locator('.checkout_summary_container')).toBeVisible()
  }

  async getOrderTotal(): Promise<string> {
    return (await this.page.locator('.summary_total_label').textContent()) ?? ''
  }

  async finish() {
    await this.page.click('[data-test="finish"]')
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/checkout-complete/)
    await expect(this.page.locator('[data-test="complete-header"]')).toContainText('Thank you')
  }
}
