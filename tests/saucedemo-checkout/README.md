// This file contains README content for the test suite
// File should be saved as: tests/saucedemo-checkout/README.md

/**
# SauceDemo E-Commerce Checkout Test Suite

## Overview
This comprehensive test suite provides automated testing for the SauceDemo e-commerce platform's checkout process. The suite covers 9 test categories with 57+ test cases, testing every aspect of the shopping cart and checkout workflow.

## Test Files

| File | Tests | Description |
|------|-------|-------------|
| `cart-review.spec.ts` | 5 | Cart items viewing, pricing verification, item removal |
| `cart-totals.spec.ts` | 4 | Cart calculations, navigation between pages |
| `checkout-validation.spec.ts` | 11 | Form field validation, required fields, special characters |
| `order-overview.spec.ts` | 8 | Order summary display, payment/shipping, calculations |
| `order-completion.spec.ts` | 4 | Order success, confirmation messages |
| `error-handling.spec.ts` | 8 | Error validation, edge cases, error recovery |
| `navigation-flow.spec.ts` | 5 | Complete user flows, URL navigation, back button |
| `ui-elements.spec.ts` | 6 | UI element verification, buttons, badges, titles |
| `accessibility.spec.ts` | 6 | Cross-browser compatibility, keyboard navigation |

**Total: 57+ test cases covering all scenarios from the test plan**

## Application Details

- **URL:** https://www.saucedemo.com
- **Test Credentials:** 
  - Username: `standard_user`
  - Password: `secret_sauce`

## Setup & Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Run all tests
```bash
npx playwright test tests/saucedemo-checkout
```

### Run specific test file
```bash
npx playwright test tests/saucedemo-checkout/cart-review.spec.ts
```

### Run specific test
```bash
npx playwright test tests/saucedemo-checkout/cart-review.spec.ts -g "View cart items"
```

### Run on specific browser
```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit
```

### Run with UI mode (visual debugging)
```bash
npx playwright test --ui
```

### Run with debug mode
```bash
npx playwright test --debug
```

### View test report
```bash
npx playwright show-report
```

## Test Coverage

### 1. Cart Review and Navigation
- [x] View cart items with correct details and pricing
- [x] Calculate and display correct total amount on cart
- [x] Continue Shopping button returns to inventory
- [x] Remove item from cart
- [x] Invalid cart state - empty cart checkout attempt

### 2. Checkout Information Entry and Validation
- [x] Successfully enter valid checkout information
- [x] Validate required field - First Name
- [x] Validate required field - Last Name
- [x] Validate required field - Postal Code
- [x] Validate all fields are required
- [x] Accept special characters in name fields
- [x] Numeric values accepted in First and Last Name
- [x] Cancel button returns to cart
- [x] Long string values in name fields
- [x] Single character values in fields
- [x] Whitespace-only input validation

### 3. Order Overview and Payment Information
- [x] Display order summary with all items and calculations
- [x] Verify payment information display
- [x] Verify shipping information display
- [x] Verify accurate subtotal calculation
- [x] Verify accurate tax calculation
- [x] Verify accurate total amount calculation
- [x] Cancel from checkout overview
- [x] Multiple items with varying quantities

### 4. Order Completion and Success
- [x] Successful order completion with success message
- [x] Back Home button returns to inventory
- [x] Order confirmation page information
- [x] Order completion with various names/postal codes

### 5. Error Handling and Edge Cases
- [x] Invalid checkout information - empty fields
- [x] Special characters handling
- [x] Very long input strings
- [x] Leading and trailing spaces
- [x] Postal code with non-numeric characters
- [x] Back button navigation
- [x] Error icons display
- [x] Form field recovery after error

### 6. Navigation and User Flow
- [x] Complete checkout flow from inventory to completion
- [x] Cart page navigation - continue shopping
- [x] Cancel button preserves cart
- [x] Browser back button functionality
- [x] Direct URL navigation to checkout pages

### 7. UI Elements and Field Validation
- [x] Verify all input field types and attributes
- [x] Verify buttons are clickable and properly labeled
- [x] Verify cart badge displays correct count
- [x] Verify page titles and headings
- [x] Verify error message formatting
- [x] Verify field focus and input behavior

### 8. Accessibility and Cross-Browser Compatibility
- [x] Checkout flow on Chrome browser
- [x] Checkout flow on Firefox browser
- [x] Checkout flow on Safari browser
- [x] Form labels are properly associated
- [x] Error messages are screen-reader friendly
- [x] Keyboard navigation through checkout form

## Key Selectors & Locators

### Authentication
- Username: `[data-test="username"]`
- Password: `[data-test="password"]`
- Login Button: `[data-test="login-button"]`

### Shopping Cart
- Add to Cart: `[data-test="add-to-cart-<product-name>"]`
- Shopping Cart Link: `[data-test="shopping-cart-link"]`
- Cart Badge: `[data-test="shopping-cart-badge"]`
- Checkout Button: `[data-test="checkout"]`

### Checkout Step 1
- First Name: `[data-test="firstName"]`
- Last Name: `[data-test="lastName"]`
- Postal Code: `[data-test="postalCode"]`
- Continue: `[data-test="continue"]`
- Cancel: `button:has-text("Cancel")`

### Checkout Step 2
- Finish: `[data-test="finish"]`
- Payment Info: `text=SauceCard #31337`
- Shipping Info: `text=Free Pony Express Delivery!`

### Order Complete
- Back Home: `button:has-text("Back Home")`
- Success Message: `text=Thank you for your order!`

## Product Pricing

- Sauce Labs Backpack: $29.99
- Sauce Labs Bike Light: $9.99
- Sauce Labs Bolt T-Shirt: $15.99
- Sauce Labs Fleece Jacket: $49.99
- Sauce Labs Onesie: $7.99
- Test.allTheThings() T-Shirt: $15.99

## Calculated Test Totals

### 2-Item Order (Backpack + Bike Light)
- Subtotal: $39.98
- Tax (8%): $3.20
- Total: $43.18

### 3-Item Order (Backpack + Bike Light + T-Shirt)
- Subtotal: $55.97
- Tax (8%): $4.48
- Total: $60.45

## Test Insights

### Timing Strategy
- All tests use Playwright's built-in implicit waiting
- No explicit wait statements needed
- Page transitions are fast (~1-2 seconds)
- Application uses optimistic UI updates

### Browser Support
- ✓ Chromium (Chrome/Edge)
- ✓ Firefox
- ✓ WebKit (Safari)

### Form Validation
- All three checkout fields are required
- Error messages are specific and clear
- Special characters are accepted
- Numeric postal codes are accepted
- Alphanumeric postal codes work: A1B2C3
- Very long strings (100+ chars) are handled
- Leading/trailing whitespace is preserved

### Cart Behavior
- Cart badge updates instantly
- "Add to cart" changes to "Remove" for added items
- Cart persists across page navigation
- Empty cart prevents checkout (may show message)
- Continue Shopping preserves cart state

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright Tests
  run: npx playwright test tests/saucedemo-checkout
  
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Tests timing out
- Application may be slow to respond
- Check internet connection
- Try running on specific browser: `--project=chromium`

### Selector not found
- Element may have changed in the app
- Run tests with `--debug` flag to inspect elements
- Check browser console for errors

### Layout issues
- Use `--headed` flag to see visual execution
- Check viewport size in playwright.config.ts
- Verify CSS isn't blocking elements

## Best Practices Used

1. **Stable Selectors:** Using data-test attributes (most stable)
2. **Implicit Waits:** Playwright waits automatically for elements
3. **Clear Test Names:** Descriptive test titles matching test plan
4. **No Wait Timeouts:** No hardcoded delays or page.waitForTimeout()
5. **Proper Setup/Teardown:** Uses beforeEach for common setup
6. **Logical Organization:** Tests grouped by feature/flow
7. **Cross-Browser:** All tests run on Chrome, Firefox, Safari
8. **Accessibility:** Tests verify keyboard navigation and labels

## Maintenance

When the SauceDemo application changes:

1. **Check Selectors First:** Most changes break selectors
2. **Review Error Messages:** Messages may update
3. **Verify Calculations:** Tax/price logic might change
4. **Test URLs:** Navigation paths may differ
5. **Update Credentials:** Login details may change

## Generate Test Report

```bash
# Generate HTML report
npx playwright test tests/saucedemo-checkout

# View the report
npx playwright show-report
```

## Contact & Support

For test suite updates or questions:
- Check the test plan: `specs/saucedemo-checkout-test-plan.md`
- Review element selectors in test files
- Run with `--debug` flag for interactive debugging

---

**Test Suite Generated:** 2026-04-01  
**Framework:** Playwright  
**Language:** TypeScript  
**Coverage:** 57+ test cases  
**Status:** Ready for CI/CD Integration
*/
