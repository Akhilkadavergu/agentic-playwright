// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Cart Review and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto(SAUCEDEMO_URL);
    
    // Login with standard_user
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    // Wait for inventory page to load
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('View cart items with correct details and pricing', async ({ page }) => {
    // Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart badge shows 2 items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Navigate to shopping cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page displays with heading
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Verify both items are visible with correct details
    await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
    
    // Verify quantities display as 1 for each item
    const quantities = page.locator('div.cart_quantity');
    const quantityCount = await quantities.count();
    for (let i = 0; i < quantityCount; i++) {
      await expect(quantities.nth(i)).toContainText('1');
    }
    
    // Verify prices display correctly
    await expect(page.locator('text=$29.99')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    
    // Verify cart item details section has correct columns and buttons
    await expect(page.locator('text=QTY')).toBeVisible();
    await expect(page.locator('text=Description')).toBeVisible();
    
    // Verify Remove buttons are present for each item
    const removeButtons = page.locator('button:has-text("Remove")');
    await expect(removeButtons).toHaveCount(2);
    
    // Verify navigation buttons
    await expect(page.locator('button:has-text("Continue Shopping")')).toBeVisible();
    await expect(page.locator('button:has-text("Checkout")')).toBeVisible();
  });
});
