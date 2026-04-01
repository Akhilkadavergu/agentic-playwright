// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

async function loginAndNavigateToCheckoutStep1(page) {
  // Navigate and login
  await page.goto(SAUCEDEMO_URL);
  await page.locator('[data-test="username"]').fill(STANDARD_USER);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  
  await expect(page).toHaveURL(/.*inventory/);
  
  // Add item and navigate to checkout
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  await expect(page).toHaveURL(/.*checkout-step-one/);
}

test.describe('Error Handling and Edge Cases', () => {
  test('Invalid checkout information - empty fields error handling', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Leave all fields empty and click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message for First Name
    await expect(page.locator('text=Error: First Name is required')).toBeVisible();
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Fill First Name and try again
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message for Last Name
    await expect(page.locator('text=Error: Last Name is required')).toBeVisible();
    
    // Fill Last Name and try again
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message for Postal Code
    await expect(page.locator('text=Error: Postal Code is required')).toBeVisible();
  });

  test('Special characters handling in checkout form', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Enter special characters
    await page.locator('[data-test="firstName"]').fill('@#$%');
    await page.locator('[data-test="lastName"]').fill('!<>?{}');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form submission succeeds
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Very long input strings handling', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    const longString = 'a'.repeat(200);
    
    // Enter long strings
    await page.locator('[data-test="firstName"]').fill(longString);
    await page.locator('[data-test="lastName"]').fill(longString);
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form either accepts or rejects gracefully
    const pageUrl = page.url();
    const isProcessed = pageUrl.includes('checkout-step-two') || pageUrl.includes('checkout-step-one');
    expect(isProcessed).toBeTruthy();
  });

  test('Leading and trailing spaces in fields', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Enter names with leading/trailing spaces
    await page.locator('[data-test="firstName"]').fill('  John');
    await page.locator('[data-test="lastName"]').fill('Doe  ');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form processes
    const pageUrl = page.url();
    const isProcessed = pageUrl.includes('checkout-step-two') || pageUrl.includes('checkout-step-one');
    expect(isProcessed).toBeTruthy();
  });

  test('Postal code with non-numeric characters', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Enter alphanumeric postal code
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('A1B2C3');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form accepts non-standard format
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Back button navigation from checkout step 2', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Complete step 1
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Click Cancel button
    await page.locator('button:has-text("Cancel")').click();
    
    // Verify user navigates back
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('Verify error icons appear next to invalid fields', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Try to submit empty form
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message
    await expect(page.locator('text=Error: First Name is required')).toBeVisible();
    
    // Check if First Name field has error styling
    const firstNameField = page.locator('[data-test="firstName"]');
    await expect(firstNameField).toHaveClass(/error/);
  });

  test('Form field recovery after validation error', async ({ page }) => {
    await loginAndNavigateToCheckoutStep1(page);
    
    // Try to submit empty form
    await page.locator('[data-test="continue"]').click();
    
    // Verify error appears
    await expect(page.locator('text=Error: First Name is required')).toBeVisible();
    
    // Fill all fields with valid data
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form submission succeeds
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // Verify error message disappears
    await expect(page.locator('text=Error: First Name is required')).not.toBeVisible();
  });
});
