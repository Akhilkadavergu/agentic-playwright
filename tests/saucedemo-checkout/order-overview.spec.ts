// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

async function loginAndNavigateToCheckout(page, itemsToAdd = 2) {
  // Navigate and login
  await page.goto(SAUCEDEMO_URL);
  await page.locator('[data-test="username"]').fill(STANDARD_USER);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  
  await expect(page).toHaveURL(/.*inventory/);
  
  // Add items to cart based on parameter
  if (itemsToAdd >= 1) {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  }
  if (itemsToAdd >= 2) {
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  }
  if (itemsToAdd >= 3) {
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  }
  
  // Navigate to cart and checkout
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  // Complete checkout info
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  
  // Wait for step 2 to load
  await expect(page).toHaveURL(/.*checkout-step-two/);
}

test.describe('Order Overview and Payment Information', () => {
  test('Display order summary with all items and calculations', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 3);
    
    // Verify page displays checkout overview
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
    
    // Verify all items are displayed (use class selector to avoid matching descriptions)
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Backpack")')).toBeVisible();
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Bike Light")')).toBeVisible();
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Bolt T-Shirt")')).toBeVisible();
    
    // Verify QTY and Description columns
    await expect(page.locator('text=QTY')).toBeVisible();
    await expect(page.locator('text=Description')).toBeVisible();
    
    // Verify prices are displayed
    await expect(page.locator('text=$29.99')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    await expect(page.locator('text=$15.99')).toBeVisible();
    
    // Verify totals section (use data-test attributes to be specific)
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('text=Tax:')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
  });

  test('Verify payment information display', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 2);
    
    // Verify payment information section
    await expect(page.locator('text=Payment Information:')).toBeVisible();
    
    // Verify payment method is displayed
    await expect(page.locator('text=SauceCard #31337')).toBeVisible();
  });

  test('Verify shipping information display', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 2);
    
    // Verify shipping information section
    await expect(page.locator('text=Shipping Information:')).toBeVisible();
    
    // Verify shipping method is displayed
    await expect(page.locator('text=Free Pony Express Delivery!')).toBeVisible();
  });

  test('Verify accurate subtotal calculation', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 3);
    
    // Item total: $55.97 (29.99 + 9.99 + 15.99)
    await expect(page.locator('text=Item total: $55.97')).toBeVisible();
  });

  test('Verify accurate tax calculation', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 3);
    
    // Tax should be approximately 8% of subtotal
    // For $55.97, tax should be around $4.48
    await expect(page.locator('text=Tax: $4.48')).toBeVisible();
  });

  test('Verify accurate total amount calculation', async ({ page }) => {
    // Add backpack and bike light
    await loginAndNavigateToCheckout(page, 2);
    
    // Item total: $39.98 (29.99 + 9.99)
    await expect(page.locator('text=Item total: $39.98')).toBeVisible();
    
    // Tax: $3.20 (approximately 8%)
    await expect(page.locator('text=Tax: $3.20')).toBeVisible();
    
    // Total: $43.18 (39.98 + 3.20)
    await expect(page.locator('text=Total: $43.18')).toBeVisible();
  });

  test('Cancel from checkout overview returns to inventory', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 2);
    
    // Click Cancel button
    await page.locator('button:has-text("Cancel")').click();
    
    // Verify user is redirected to inventory
    await expect(page).toHaveURL(/.*inventory/);
    
    // Verify cart items are preserved
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
  });

  test('Multiple items with varying quantities display correctly', async ({ page }) => {
    await loginAndNavigateToCheckout(page, 3);
    
    // Verify all items appear in summary (use class selector to avoid matching descriptions)
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Backpack")')).toBeVisible();
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Bike Light")')).toBeVisible();
    await expect(page.locator('[class="inventory_item_name"]:has-text("Sauce Labs Bolt T-Shirt")')).toBeVisible();
    
    // Verify quantities display
    const quantities = page.locator('div.cart_quantity');
    const count = await quantities.count();
    
    // Each added item should have quantity 1
    for (let i = 0; i < count; i++) {
      await expect(quantities.nth(i)).toContainText('1');
    }
    
    // Verify all prices are correct
    await expect(page.locator('text=$29.99')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    await expect(page.locator('text=$15.99')).toBeVisible();
    
    // Verify totals are calculated (use data-test attribute to be specific)
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
  });
});
