// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const SAUCEDEMO_URL = 'https://www.saucedemo.com';
const STANDARD_USER = 'standard_user';
const PASSWORD = 'secret_sauce';

async function loginAndNavigateToCheckoutForm(page) {
  await page.goto(SAUCEDEMO_URL);
  await page.locator('[data-test="username"]').fill(STANDARD_USER);
  await page.locator('[data-test="password"]').fill(PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  
  await expect(page).toHaveURL(/.*inventory/);
  
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  
  await expect(page).toHaveURL(/.*checkout-step-one/);
}

test.describe('UI Elements and Field Validation', () => {
  test('Verify all input field types and attributes', async ({ page }) => {
    await loginAndNavigateToCheckoutForm(page);
    
    // Verify First Name field
    const firstNameField = page.locator('[data-test="firstName"]');
    await expect(firstNameField).toBeVisible();
    
    // Verify Last Name field
    const lastNameField = page.locator('[data-test="lastName"]');
    await expect(lastNameField).toBeVisible();
    
    // Verify Postal Code field
    const postalCodeField = page.locator('[data-test="postalCode"]');
    await expect(postalCodeField).toBeVisible();
    
    // Verify fields are input elements
    const firstNameType = await firstNameField.getAttribute('type');
    const lastNameType = await lastNameField.getAttribute('type');
    const postalCodeType = await postalCodeField.getAttribute('type');
    
    expect(firstNameType).toBeTruthy();
    expect(lastNameType).toBeTruthy();
    expect(postalCodeType).toBeTruthy();
  });

  test('Verify buttons are clickable and properly labeled', async ({ page }) => {
    await loginAndNavigateToCheckoutForm(page);
    
    // Verify Continue button
    const continueBtn = page.locator('[data-test="continue"]');
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toContainText('Continue');
    
    // Verify Cancel button
    const cancelBtn = page.locator('button:has-text("Cancel")');
    await expect(cancelBtn).toBeVisible();
    
    // Navigate to step 2 to check those buttons
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await continueBtn.click();
    
    // Verify Finish button
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();
    await expect(finishBtn).toContainText('Finish');
    
    // Verify Cancel button on step 2
    const cancelBtn2 = page.locator('button:has-text("Cancel")');
    await expect(cancelBtn2).toBeVisible();
  });

  test('Verify cart badge displays correct count', async ({ page }) => {
    // Login
    await page.goto(SAUCEDEMO_URL);
    await page.locator('[data-test="username"]').fill(STANDARD_USER);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    
    await expect(page).toHaveURL(/.*inventory/);
    
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    
    // Start with empty cart - badge should not be visible
    await expect(cartBadge).not.toBeVisible();
    
    // Add 1 item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(cartBadge).toContainText('1');
    
    // Add 3 more items
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    
    await expect(cartBadge).toContainText('4');
    
    // Navigate to cart and remove 2 items
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    const removeButtons = await page.locator('button:has-text("Remove")').all();
    await removeButtons[0].click();
    await removeButtons[1].click();
    
    // Verify badge updates to 2
    await expect(cartBadge).toContainText('2');
  });

  test('Verify page titles and headings at each checkout step', async ({ page }) => {
    await loginAndNavigateToCheckoutForm(page);
    
    // Verify step 1 heading
    await expect(page.locator('text=Checkout: Your Information')).toBeVisible();
    
    // Proceed to step 2
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify step 2 heading
    await expect(page.locator('text=Checkout: Overview')).toBeVisible();
    
    // Complete order
    await page.locator('[data-test="finish"]').click();
    
    // Verify completion page heading
    await expect(page.locator('text=Checkout: Complete!')).toBeVisible();
  });

  test('Verify error message formatting and display', async ({ page }) => {
    await loginAndNavigateToCheckoutForm(page);
    
    // Submit empty form to trigger First Name error
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message is displayed
    const errorElement = page.locator('text=Error: First Name is required');
    await expect(errorElement).toBeVisible();
    
    // Fill First Name to trigger Last Name error
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message is updated
    await expect(page.locator('text=Error: Last Name is required')).toBeVisible();
    
    // Verify previous error disappears
    await expect(page.locator('text=Error: First Name is required')).not.toBeVisible();
  });

  test('Verify field focus and input behavior', async ({ page }) => {
    await loginAndNavigateToCheckoutForm(page);
    
    // Click on First Name field
    const firstNameField = page.locator('[data-test="firstName"]');
    await firstNameField.click();
    
    // Type in First Name field
    await firstNameField.type('John', { delay: 50 });
    await expect(firstNameField).toHaveValue('John');
    
    // Press Tab to move to Last Name field
    await page.keyboard.press('Tab');
    
    const lastNameField = page.locator('[data-test="lastName"]');
    
    // Type in Last Name field
    await lastNameField.type('Doe', { delay: 50 });
    await expect(lastNameField).toHaveValue('Doe');
    
    // Press Tab to move to Postal Code field
    await page.keyboard.press('Tab');
    
    const postalCodeField = page.locator('[data-test="postalCode"]');
    
    // Type in Postal Code field
    await postalCodeField.type('12345', { delay: 50 });
    await expect(postalCodeField).toHaveValue('12345');
  });
});
