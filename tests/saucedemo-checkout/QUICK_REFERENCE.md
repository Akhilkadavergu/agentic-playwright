// QUICK REFERENCE GUIDE
// File: tests/saucedemo-checkout/QUICK_REFERENCE.md

/**
# SauceDemo Test Suite - Quick Reference

## 🎯 At a Glance

**Total Tests:** 57+  |  **Files:** 9  |  **Categories:** 8  |  **Browsers:** 3

## 📂 Test File Structure

```
tests/saucedemo-checkout/
├── 🛒 CART TESTS
│   ├── cart-review.spec.ts (5 tests)        → Cart viewing & removal
│   └── cart-totals.spec.ts (4 tests)        → Price calculations
├── 📝 CHECKOUT TESTS
│   ├── checkout-validation.spec.ts (11)     → Form validation
│   └── error-handling.spec.ts (8 tests)     → Error scenarios
├── 📊 ORDER TESTS
│   ├── order-overview.spec.ts (8 tests)     → Summary & calculations
│   └── order-completion.spec.ts (4 tests)   → Success & confirmation
├── 🔄 NAVIGATION & UI
│   ├── navigation-flow.spec.ts (5 tests)    → User flows
│   └── ui-elements.spec.ts (6 tests)        → UI verification
├── ♿ ACCESSIBILITY
│   └── accessibility.spec.ts (6 tests)      → Cross-browser & keyboard
└── 📚 DOCUMENTATION
    ├── README.md                             → Full documentation
    ├── EXECUTION_SUMMARY.md                  → Complete summary
    └── TEST_DOCUMENTATION.spec.ts            → Reference test
```

## ⚡ Quick Commands

```bash
# Run all tests
npx playwright test tests/saucedemo-checkout

# Run one file
npx playwright test tests/saucedemo-checkout/cart-review.spec.ts

# Run specific test
npx playwright test -g "View cart items"

# Run on Chrome only
npx playwright test --project=chromium

# Visual mode (watch UI)
npx playwright test --ui

# Debug mode
npx playwright test --debug

# See results
npx playwright show-report
```

## 🔐 Credentials

```javascript
Username: standard_user
Password: secret_sauce
URL:      https://www.saucedemo.com
```

## 📊 Test Coverage Map

```
CATEGORY                        TESTS   FILES               STATUS
─────────────────────────────────────────────────────────────────
Cart Review & Navigation         5     cart-*.spec.ts       ✅✅✅✅✅
Checkout Validation             11     checkout-validation  ✅✅✅✅✅✅✅✅✅✅✅
Order Overview                   8     order-overview       ✅✅✅✅✅✅✅✅
Order Completion                 4     order-completion     ✅✅✅✅
Error Handling                   8     error-handling       ✅✅✅✅✅✅✅✅
Navigation & Flow                5     navigation-flow      ✅✅✅✅✅
UI Elements                       6     ui-elements          ✅✅✅✅✅✅
Accessibility                    6     accessibility        ✅✅✅✅✅✅
─────────────────────────────────────────────────────────────────
TOTAL                           57+    9 files              ✅ COMPLETE
```

## 🎯 Common Test Patterns

### Test Structure Example
```javascript
test.describe('Category Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and navigate
    await page.goto(URL);
    await login(page, STANDARD_USER, PASSWORD);
  });

  test('Test name', async ({ page }) => {
    // Action
    await page.click(selector);
    
    // Assertion
    await expect(page.locator('text')).toBeVisible();
  });
});
```

### Selector Patterns
```javascript
// Data attributes (most stable)
[data-test="elementName"]

// Text content
text=Expected Text

// Button with text
button:has-text("Button Text")

// Complex selectors
div.class >> text=Text
```

## 💾 Key Selectors (Bookmarks)

### Login
- Username: `[data-test="username"]`
- Password: `[data-test="password"]`
- Login: `[data-test="login-button"]`

### Shopping
- Add Item: `[data-test="add-to-cart-<name>"]`
- Cart: `[data-test="shopping-cart-link"]`
- Badge: `[data-test="shopping-cart-badge"]`
- Checkout: `[data-test="checkout"]`

### Forms
- First Name: `[data-test="firstName"]`
- Last Name: `[data-test="lastName"]`
- Postal Code: `[data-test="postalCode"]`
- Continue: `[data-test="continue"]`
- Finish: `[data-test="finish"]`
- Cancel: `button:has-text("Cancel")`

## 💰 Test Data Reference

### Prices
- Backpack: $29.99
- Bike Light: $9.99
- T-Shirt: $15.99
- Fleece Jacket: $49.99
- Onesie: $7.99

### Expected Totals
- 2 items: $39.98 subtotal → $43.18 total (with 8% tax)
- 3 items: $55.97 subtotal → $60.45 total (with 8% tax)

### Fixed Values
- Payment: SauceCard #31337
- Shipping: Free Pony Express Delivery!
- Tax Rate: 8%

## 🔧 Debugging Tips

```bash
# See what's happening
npx playwright test --headed

# Step through tests
npx playwright test --debug

# View specific failure
npx playwright test -g "test name" --headed

# Check selectors in browser
npx playwright codegen https://www.saucedemo.com
```

## 📋 Assertion Cheat Sheet

```javascript
// Text
await expect(el).toContainText('text')
await expect(el).toHaveText('exact')

// Visibility
await expect(el).toBeVisible()
await expect(el).not.toBeVisible()

// Value
await expect(el).toHaveValue('value')

// URL
await expect(page).toHaveURL(/pattern/)

// Count
await expect(els).toHaveCount(5)

// Class
await expect(el).toHaveClass(/error/)

// Enabled/Disabled
await expect(el).toBeEnabled()
```

## 🚀 Performance Notes

- No hardcoded delays used
- All waits are implicit
- Tests run in parallel by default
- ~1-2 seconds per test
- HTML report generated automatically

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Element not found" | Run with `--debug` to inspect, check selector |
| Test times out | Check network, try `--headed` to see UI |
| Flaky test | Look for implicit wait issues, check timing |
| Cart empty | Prerequisite not run, check beforeEach |
| Wrong values | Check pricing, tax calculation (8%), ensure items added |

## 📚 Documentation Files

- **README.md** - Full setup and usage guide
- **EXECUTION_SUMMARY.md** - Complete test summary
- **TEST_DOCUMENTATION.spec.ts** - Reference documentation
- **This file** - Quick reference (you are here)

## ✅ Pre-Test Checklist

- [ ] Node.js installed
- [ ] Dependencies installed: `npm install`
- [ ] Browsers installed: `npx playwright install`
- [ ] Internet connection active
- [ ] SauceDemo site accessible

## 🎬 Quick Start

```bash
# 1. Install
npm install && npx playwright install

# 2. Run tests
npx playwright test tests/saucedemo-checkout

# 3. View results
npx playwright show-report
```

## 📞 Need Help?

1. Check test file comments
2. Read README.md
3. Review EXECUTION_SUMMARY.md
4. Run with `--debug` flag
5. Check test plan: specs/saucedemo-checkout-test-plan.md

---

**Generated:** 2026-04-01  
**Framework:** Playwright  
**Version:** Latest  
**Status:** Ready to Run  

*/
