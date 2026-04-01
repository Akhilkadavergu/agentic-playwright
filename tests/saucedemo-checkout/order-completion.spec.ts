// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

async function completeFullCheckout(page) {
  // Navigate and login
  await page.goto(SAUCEDEMO_URL);
  await page.locator('[data-test="username"]').fill(STANDARD_USER);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  
  await expect(page).toHaveURL(/.*inventory/);
  
  // Add items
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  
  // Navigate to cart and checkout
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  // Complete checkout info
  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();
  
  // Complete the order
  await expect(page).toHaveURL(/.*checkout-step-two/);
  await page.locator('[data-test="finish"]').click();
  
  // Wait for completion page
  await expect(page).toHaveURL(/.*checkout-complete/);
}

test.describe('Order Completion and Success', () => {
  test('Successful order completion with success message', async ({ page }) => {
    // Navigate and login
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart contains 2 items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('2');
    
    // Navigate to cart and checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
    
    // Click Checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Fill checkout info
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify order overview
    await expect(page).toHaveURL(/.*checkout-step-two/);
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
    
    // Click Finish
    await page.locator('[data-test="finish"]').click();
    
    // Verify success page
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(page.locator('text=Checkout: Complete!')).toBeVisible();
    
    // Verify success message
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
    
    // Verify dispatch message
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();
    
    // Verify Pony Express icon is visible
    await expect(page.locator('img[alt="Pony Express"]')).toBeVisible();
  });

  test('Back Home button returns to inventory page', async ({ page }) => {
    await completeFullCheckout(page);
    
    // Click Back Home button
    await page.locator('button:has-text("Back Home")').click();
    
    // Verify redirect to inventory
    await expect(page).toHaveURL(/.*inventory/);
    
    // Verify product listing is displayed
    await expect(page.locator('text=Products')).toBeVisible();
    
    // Verify cart is reset
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).not.toBeVisible();
  });

  test('Order confirmation page displays all relevant information', async ({ page }) => {
    await completeFullCheckout(page);
    
    // Verify page heading
    await expect(page.locator('text=Checkout: Complete!')).toBeVisible();
    
    // Verify success heading
    const successHeading = page.locator('h2:has-text("Thank you for your order!")');
    await expect(successHeading).toBeVisible();
    
    // Verify confirmation message is present
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();
    
    // Verify Pony Express image
    await expect(page.locator('img[alt="Pony Express"]')).toBeVisible();
    
    // Verify Back Home button
    await expect(page.locator('button:has-text("Back Home")')).toBeVisible();
  });

  test('Order completion with various names and postal codes', async ({ page }) => {
    // Navigate and login
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Complete checkout with international characters
    await page.locator('[data-test="firstName"]').fill('María');
    await page.locator('[data-test="lastName"]').fill('García');
    await page.locator('[data-test="postalCode"]').fill('28001');
    
    // Proceed to step 2
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Verify order overview displays correctly
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
    
    // Complete order
    await page.locator('[data-test="finish"]').click();
    
    // Verify order completes successfully
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
  });
});
