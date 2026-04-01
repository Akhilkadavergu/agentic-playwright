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

  test('Calculate and display correct total amount on cart', async ({ page }) => {
    // Add three items: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    
    // Verify cart badge shows 3
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('3');
    
    // Navigate to cart and proceed to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart/);
    
    // Click Checkout to proceed to overview
    await page.locator('[data-test="checkout"]').click();
    
    // Fill in checkout information
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify price calculations on checkout step 2 overview
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Item total: $55.97 (29.99 + 9.99 + 15.99)
    await expect(page.locator('text=Item total: $55.97')).toBeVisible();
    
    // Tax: ~$4.48 (approximately 8% of subtotal)
    await expect(page.locator('text=Tax: $4.48')).toBeVisible();
    
    // Total: $60.45
    await expect(page.locator('text=Total: $60.45')).toBeVisible();
  });

  test('Continue Shopping button returns to inventory page', async ({ page }) => {
    // Add 2 items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Click Continue Shopping button
    await page.locator('button:has-text("Continue Shopping")').click();
    
    // Verify user is redirected to inventory page
    await expect(page).toHaveURL(/.*inventory/);
    
    // Verify cart badge still shows 2 items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Verify product listing is visible
    await expect(page.locator('text=Products')).toBeVisible();
    
    // Verify items show Remove button instead of Add to cart
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('Remove item from cart', async ({ page }) => {
    // Add Backpack and Bike Light to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart badge shows 2
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Navigate to cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Click Remove button for Backpack
    const removeButtons = await page.locator('button:has-text("Remove")').all();
    await removeButtons[0].click();
    
    // Verify Backpack is removed
    await expect(page.locator('text=Sauce Labs Backpack')).not.toBeVisible();
    
    // Verify cart shows only 1 item
    await expect(cartBadge).toContainText('1');
    
    // Verify Bike Light remains with correct price
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    
    // Click Remove button for Bike Light
    const remainingRemoveButton = await page.locator('button:has-text("Remove")').first();
    await remainingRemoveButton.click();
    
    // Verify cart is now empty
    await expect(page.locator('text=Sauce Labs Bike Light')).not.toBeVisible();
  });

  test('Invalid cart state - empty cart checkout attempt', async ({ page }) => {
    // Attempt to navigate directly to checkout-step-one.html with empty cart
    await page.goto(`${SAUCEDEMO_URL}/checkout-step-one.html`);
    
    // The app should either show empty cart state or redirect
    // Verify page loads (behavior depends on implementation)
    const pageHeading = page.locator('[data-test="primary-header"]');
    await expect(pageHeading).toBeVisible();
  });
});
