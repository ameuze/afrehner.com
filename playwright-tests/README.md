# Playwright Tests

Test automation suites for [afrehner.com](https://afrehner.com) — built with Playwright and TypeScript using Page Object Model architecture.

These aren't hidden in a CI pipeline. They run **live on the portfolio site** — visitors trigger them from the browser and watch real Playwright output stream in real time. The test code here is both the product and the proof of skill.

## Test Suites

### SauceDemo E2E Suite (`tests/demo-saucedemo.spec.ts`)

Six end-to-end tests against [saucedemo.com](https://www.saucedemo.com) demonstrating core automation patterns:

| Test | What it validates |
|---|---|
| **TC-001** Valid login | Standard user authentication, inventory page load, item count assertion |
| **TC-002** Invalid login | Error message validation for bad credentials |
| **TC-003** Locked-out user | Account lockout error handling |
| **TC-004** Add items to cart | Multi-item cart operations, badge count verification |
| **TC-005** Full checkout flow | Login through order completion — cart, checkout form, order summary, confirmation |
| **TC-006** Product sort | Price sorting with extracted values, ascending order assertion |

### Portfolio Self-Test Suite (`tests/portfolio.spec.ts`)

Seven functional tests that validate the portfolio site itself:

| Test | What it validates |
|---|---|
| **TC-P01** Homepage load | Page load, hero section visibility, heading render |
| **TC-P02** Navigation | Nav bar presence, minimum link count |
| **TC-P03** Page sections | All major sections present in DOM (`#hero`, `#about`, `#skills`, `#projects`, `#contact`) |
| **TC-P04** Skills display | Skills section renders skill items |
| **TC-P05** Project cards | Projects section renders at least one project card |
| **TC-P06** Contact email | `mailto:` link present and valid |
| **TC-P07** Theme toggle | Dark mode default, toggle to light, toggle back to dark |

The portfolio suite reads `PORTFOLIO_URL` from the environment, defaulting to `http://localhost:5173` for local development.

## Page Object Model

The test architecture follows POM with a clear hierarchy:

```
BasePage (abstract)
  - waitForPageLoad()
  - getTitle()
  - takeScreenshot(name)

SauceDemoPage.ts
  - LoginPage       → navigate, login, expectLoginError
  - InventoryPage   → addItemToCart, getCartBadgeCount, sortBy, goToCart
  - CartPage         → getCartItems, proceedToCheckout, removeItem
  - CheckoutPage     → fillInfo, expectOverviewLoaded, getOrderTotal, finish, expectOrderComplete
```

Each page object encapsulates its locators and actions. Tests read like specifications — `loginPage.login(user, pass)` then `inventoryPage.addItemToCart("Backpack")` — with no raw selectors leaking into test files.

Test data (credentials, product names, checkout info) is centralized in `utils/TestHelper.ts`.

## Running Tests

```bash
npm install

# Run all tests
npx playwright test

# Run a specific suite
npx playwright test tests/demo-saucedemo.spec.ts
npx playwright test tests/portfolio.spec.ts

# Run against production
PORTFOLIO_URL=https://afrehner.com npx playwright test tests/portfolio.spec.ts

# Run with visible browser
npx playwright test --headed

# View the HTML report after a run
npx playwright show-report
```

## Configuration

Defined in `playwright.config.ts`:

- **Browser:** Chromium only (supports system Chromium via `CHROMIUM_PATH` for Docker)
- **Workers:** 1 (serial execution)
- **Retries:** 0 locally, 1 in CI
- **Timeout:** 30 seconds per test
- **Screenshots:** Captured on failure only
- **Reporters:** List (console), HTML, JSON

## Tech Stack

Playwright 1.45, TypeScript, Page Object Model
