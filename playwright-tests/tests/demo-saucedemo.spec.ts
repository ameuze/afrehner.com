import { test, expect } from '@playwright/test'
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages/SauceDemoPage'
import { SAUCE_CREDENTIALS, TEST_PRODUCTS, CHECKOUT_INFO } from '../utils/TestHelper'

test.describe('SauceDemo E2E Suite', () => {
  test.describe.configure({ mode: 'serial' })

  test('TC-001 | Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.navigate()
    await loginPage.login(SAUCE_CREDENTIALS.standard.username, SAUCE_CREDENTIALS.standard.password)
    await inventoryPage.expectLoaded()

    const itemCount = await inventoryPage.getItemCount()
    expect(itemCount).toBeGreaterThan(0)
    console.log(`  → Found ${itemCount} products on inventory page`)
  })

  test('TC-002 | Login with invalid credentials shows error', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigate()
    await loginPage.login('wrong_user', 'wrong_pass')
    await loginPage.expectLoginError('Username and password do not match')
    console.log('  → Error message displayed correctly')
  })

  test('TC-003 | Locked-out user sees correct error', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigate()
    await loginPage.login(SAUCE_CREDENTIALS.locked.username, SAUCE_CREDENTIALS.locked.password)
    await loginPage.expectLoginError('Sorry, this user has been locked out')
    console.log('  → Locked user error message verified')
  })

  test('TC-004 | Add items to cart and verify count', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.navigate()
    await loginPage.login(SAUCE_CREDENTIALS.standard.username, SAUCE_CREDENTIALS.standard.password)
    await inventoryPage.expectLoaded()

    await inventoryPage.addItemToCart(TEST_PRODUCTS.backpack)
    await inventoryPage.addItemToCart(TEST_PRODUCTS.bikeLight)

    const badgeCount = await inventoryPage.getCartBadgeCount()
    expect(badgeCount).toBe('2')
    console.log(`  → Cart badge shows ${badgeCount} items`)
  })

  test('TC-005 | Complete full checkout flow', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutPage = new CheckoutPage(page)

    // Login
    await loginPage.navigate()
    await loginPage.login(SAUCE_CREDENTIALS.standard.username, SAUCE_CREDENTIALS.standard.password)
    await inventoryPage.expectLoaded()

    // Add items
    await inventoryPage.addItemToCart(TEST_PRODUCTS.backpack)
    await inventoryPage.addItemToCart(TEST_PRODUCTS.boltTShirt)
    console.log(`  → Added 2 items to cart`)

    // Cart
    await inventoryPage.goToCart()
    await cartPage.expectLoaded()
    const cartItems = await cartPage.getCartItems()
    expect(cartItems).toContain(TEST_PRODUCTS.backpack)
    console.log(`  → Cart contains ${cartItems.length} items`)

    // Checkout
    await cartPage.proceedToCheckout()
    await checkoutPage.fillInfo(CHECKOUT_INFO.firstName, CHECKOUT_INFO.lastName, CHECKOUT_INFO.postalCode)
    await checkoutPage.expectOverviewLoaded()

    const total = await checkoutPage.getOrderTotal()
    console.log(`  → Order total: ${total}`)
    expect(total).toMatch(/Total:/)

    // Finish
    await checkoutPage.finish()
    await checkoutPage.expectOrderComplete()
    console.log('  → Order completed successfully')
  })

  test('TC-006 | Product sort — price low to high', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)

    await loginPage.navigate()
    await loginPage.login(SAUCE_CREDENTIALS.standard.username, SAUCE_CREDENTIALS.standard.password)
    await inventoryPage.expectLoaded()

    await inventoryPage.sortBy('lohi')

    const prices = await page.locator('.inventory_item_price').allTextContents()
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')))
    const sorted = [...numericPrices].sort((a, b) => a - b)
    expect(numericPrices).toEqual(sorted)
    console.log(`  → Prices sorted correctly: ${numericPrices.join(', ')}`)
  })
})
