// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Navigation and User Flow', () => {
  test('Complete checkout flow from inventory to completion', async ({ page }) => {
    // Step 1: Login
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Step 2: Add items to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify items show Remove button
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    
    // Verify cart badge
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Step 3: Navigate to shopping cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Step 4: Review cart items
    await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('text=$29.99')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    
    // Step 5: Click Checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Step 6: Fill checkout information
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Step 7: Click Continue
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Step 8: Review order summary
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
    await expect(page.locator('text=Payment Information:')).toBeVisible();
    await expect(page.locator('text=Shipping Information:')).toBeVisible();
    await expect(page.locator('text=Item total:')).toBeVisible();
    
    // Step 9: Click Finish
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete/);
    
    // Step 10: Verify success
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();
  });

  test('Cart page navigation - continue shopping returns to inventory', async ({ page }) => {
    // Login and add items
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Click Continue Shopping
    await page.locator('button:has-text("Continue Shopping")').click();
    
    // Verify return to inventory
    await expect(page).toHaveURL(/.*inventory/);
    
    // Verify cart badge shows items are still there
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Add more items to verify functionality
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await expect(cartBadge).toContainText('3');
  });

  test('Cancel button on checkout step 1 preserves cart', async ({ page }) => {
    // Login and navigate to checkout
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add items and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Click Cancel
    await page.locator('button:has-text("Cancel")').click();
    
    // Verify return to cart page (Cancel navigates to cart, not inventory)
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify cart preserved
    await expect(cartBadge).toContainText('2');
    
    // Verify items still in cart
    await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
  });

  test('Browser back button functionality', async ({ page }) => {
    // Navigate through checkout flow
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Navigate to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart/);
    
    // Navigate to checkout step 1
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Fill form and proceed to step 2
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Use browser back button
    await page.goBack();
    
    // Should return to step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Use back button again
    await page.goBack();
    
    // Should return to cart
    await expect(page).toHaveURL(/.*cart/);
  });

  test('Direct URL navigation to checkout pages', async ({ page }) => {
    // Login first
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Navigate directly to checkout-step-one.html
    await page.goto(`${SAUCEDEMO_URL}/checkout-step-one.html`);
    
    // Verify page loads
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    
    // Complete step 1 to proceed
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify we're on step 2
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Verify page loads properly
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
  });
});
