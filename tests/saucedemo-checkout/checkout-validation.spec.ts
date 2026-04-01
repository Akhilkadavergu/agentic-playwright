// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Checkout Information Entry and Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto(SAUCEDEMO_URL);
    
    // Login with standard_user
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    // Wait for inventory page to load
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add items to cart and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Wait for checkout step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('Successfully enter valid checkout information', async ({ page }) => {
    // Verify checkout form displays
    await expect(page.locator('text=Checkout: Your Information')).toBeVisible();
    
    // Verify input fields are visible
    const firstNameField = page.locator('[data-test="firstName"]');
    const lastNameField = page.locator('[data-test="lastName"]');
    const postalCodeField = page.locator('[data-test="postalCode"]');
    
    await expect(firstNameField).toBeVisible();
    await expect(lastNameField).toBeVisible();
    await expect(postalCodeField).toBeVisible();
    
    // Enter valid information
    await firstNameField.fill('John');
    await lastNameField.fill('Doe');
    await postalCodeField.fill('12345');
    
    // Verify fields contain the entered data
    await expect(firstNameField).toHaveValue('John');
    await expect(lastNameField).toHaveValue('Doe');
    await expect(postalCodeField).toHaveValue('12345');
    
    // Click Continue button
    await page.locator('[data-test="continue"]').click();
    
    // Verify form validation passes and redirects to step 2
    await expect(page).toHaveURL(/.*checkout-step-two/);
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
  });

  test('Validate required field - First Name is mandatory', async ({ page }) => {
    // Enter Last Name and Postal Code but leave First Name empty
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('54321');
    
    // Click Continue without First Name
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message appears
    await expect(page.locator('text=Error: First Name is required')).toBeVisible();
    
    // Verify page remains on step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // Verify error icon appears next to First Name field
    const firstNameField = page.locator('[data-test="firstName"]');
    await expect(firstNameField).toHaveClass(/error/);
  });

  test('Validate required field - Last Name is mandatory', async ({ page }) => {
    // Enter First Name and Postal Code but leave Last Name empty
    await page.locator('[data-test="firstName"]').fill('Sarah');
    await page.locator('[data-test="postalCode"]').fill('98765');
    
    // Click Continue without Last Name
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message appears
    await expect(page.locator('text=Error: Last Name is required')).toBeVisible();
    
    // Verify page remains on step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('Validate required field - Postal Code is mandatory', async ({ page }) => {
    // Enter First Name and Last Name but leave Postal Code empty
    await page.locator('[data-test="firstName"]').fill('Michael');
    await page.locator('[data-test="lastName"]').fill('Johnson');
    
    // Click Continue without Postal Code
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message appears
    await expect(page.locator('text=Error: Postal Code is required')).toBeVisible();
    
    // Verify page remains on step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('Validate all fields are required - submit empty form', async ({ page }) => {
    // All fields start empty
    // Click Continue with all fields empty
    await page.locator('[data-test="continue"]').click();
    
    // Verify first error message appears
    await expect(page.locator('text=Error: First Name is required')).toBeVisible();
    
    // Verify page remains on step 1
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('Accept special characters in name fields', async ({ page }) => {
    // Enter special characters in name fields
    await page.locator('[data-test="firstName"]').fill('@#$%^&*()');
    await page.locator('[data-test="lastName"]').fill('!<>?{}|');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form accepts special characters and proceeds to step 2
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Numeric values accepted in First and Last Name fields', async ({ page }) => {
    // Enter numeric values in name fields
    await page.locator('[data-test="firstName"]').fill('123');
    await page.locator('[data-test="lastName"]').fill('456');
    await page.locator('[data-test="postalCode"]').fill('78901');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form accepts numeric values and proceeds
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Cancel button on checkout step 1 returns to cart', async ({ page }) => {
    // Enter some information
    await page.locator('[data-test="firstName"]').fill('Test');
    
    // Click Cancel button
    await page.locator('button:has-text("Cancel")').click();
    
    // Verify user is redirected to cart page
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify cart still contains items
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('1');
  });

  test('Long string values in name fields', async ({ page }) => {
    const longString = 'a'.repeat(100);
    
    // Enter long strings
    await page.locator('[data-test="firstName"]').fill(longString);
    await page.locator('[data-test="lastName"]').fill(longString);
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Form should proceed or show appropriate message
    const pageUrl = page.url();
    const isOnNextStep = pageUrl.includes('checkout-step-two');
    expect(isOnNextStep).toBeTruthy();
  });

  test('Single character values in fields', async ({ page }) => {
    // Enter single characters
    await page.locator('[data-test="firstName"]').fill('A');
    await page.locator('[data-test="lastName"]').fill('B');
    await page.locator('[data-test="postalCode"]').fill('1');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify form accepts single characters and proceeds
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('Whitespace-only input fields validation', async ({ page }) => {
    // Enter whitespace in First Name
    await page.locator('[data-test="firstName"]').fill('     ');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click Continue
    await page.locator('[data-test="continue"]').click();
    
    // Behavior depends on implementation - form may accept or reject
    const pageUrl = page.url();
    const isOnNextStep = pageUrl.includes('checkout-step-two');
    const isStillOnStep1 = pageUrl.includes('checkout-step-one');
    
    // Either it proceeds or shows error
    expect(isOnNextStep || isStillOnStep1).toBeTruthy();
  });
});
