export const SAUCE_CREDENTIALS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
}

export const TEST_PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
}

export const CHECKOUT_INFO = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '94103',
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
