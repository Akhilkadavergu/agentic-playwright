# SCRUM-101: E-commerce Checkout Process Test Plan

## Application Overview

This comprehensive test plan covers the SauceDemo e-commerce checkout process. The application is a demo e-commerce platform (https://www.saucedemo.com) that allows users to browse products, add items to cart, and complete a checkout process. This test plan provides detailed scenarios for manual and automated testing, covering happy path flows, negative scenarios, error handling, and edge cases. The checkout process consists of 4 main stages: cart review, checkout information entry, order overview, and order completion.

## Test Scenarios

### 1. Cart Review and Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. View cart items with correct details and pricing

**File:** `tests/checkout/cart-review.spec.ts`

**Steps:**
  1. Login with standard_user / secret_sauce
    - expect: User successfully logs in and lands on inventory page
  2. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to cart
    - expect: Cart badge shows 2 items
    - expect: Items added successfully
  3. Navigate to shopping cart page by clicking cart icon
    - expect: Cart page displays with 'Your Cart' heading
    - expect: Both items are visible with correct names
    - expect: Quantities display as 1 for each item
    - expect: Prices display correctly ($29.99 and $9.99)
  4. Verify cart item details section
    - expect: QTY column displays quantity '1' for each item
    - expect: Description column shows item names and descriptions
    - expect: Price column shows individual item prices
    - expect: Remove buttons are present for each item
  5. Verify navigation options on cart page
    - expect: 'Continue Shopping' button is visible and clickable
    - expect: 'Checkout' button is visible and clickable

#### 1.2. Calculate and display correct total amount on cart

**File:** `tests/checkout/cart-totals.spec.ts`

**Steps:**
  1. Complete the prerequisite: Add three items to cart - Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99)
    - expect: Cart contains 3 items
    - expect: Cart badge shows 3
  2. Navigate to cart and proceed to checkout
    - expect: Cart page loads successfully
  3. View the cart page and note all item prices
    - expect: Item total is visible on checkout overview page after proceeding to step 2
  4. In checkout step 2 overview, verify price calculations
    - expect: Item total: $55.97 (29.99 + 9.99 + 15.99)
    - expect: Tax: $4.48 (approximately 8% of subtotal)
    - expect: Total: $60.45 (subtotal + tax)
    - expect: All calculations are accurate

#### 1.3. Continue Shopping button returns to inventory page

**File:** `tests/checkout/cart-navigation-continue.spec.ts`

**Steps:**
  1. Add 2 items to cart and navigate to cart page
    - expect: Cart page displays with 2 items
  2. Click 'Continue Shopping' button
    - expect: User is redirected back to inventory page
    - expect: Page URL changes to inventory.html
    - expect: All previously added items remain in cart (cart badge shows 2)
    - expect: Product listing is visible
  3. Verify added items still show 'Remove' button instead of 'Add to cart'
    - expect: Items in inventory show Remove button confirming they are in cart

#### 1.4. Remove item from cart

**File:** `tests/checkout/cart-remove-item.spec.ts`

**Steps:**
  1. Add Backpack and Bike Light to cart
    - expect: Cart badge shows 2 items
  2. Navigate to cart page
    - expect: Cart displays both items
  3. Click Remove button for Backpack
    - expect: Backpack is removed from cart
    - expect: Cart now shows only 1 item
    - expect: Bike Light remains in cart with correct price $9.99
  4. Click Remove button for Bike Light
    - expect: Cart is now empty
    - expect: Empty cart message may be displayed or cart shows no items

#### 1.5. Invalid cart state - empty cart checkout attempt

**File:** `tests/checkout/empty-cart-scenario.spec.ts`

**Steps:**
  1. Attempt to navigate directly to checkout-step-one.html with empty cart
    - expect: Page may display empty cart state or error message
    - expect: Checkout process may be prevented or show warnings
  2. Check if checkout can proceed with no items
    - expect: System prevents checkout or shows appropriate message

### 2. Checkout Information Entry and Validation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Successfully enter valid checkout information

**File:** `tests/checkout/valid-information-entry.spec.ts`

**Steps:**
  1. Login and add items to cart, then navigate to checkout step 1
    - expect: Checkout: Your Information page displays
    - expect: Three input fields are visible: First Name, Last Name, Zip/Postal Code
  2. Enter First Name: 'John'
    - expect: First Name field accepts and displays 'John'
  3. Enter Last Name: 'Doe'
    - expect: Last Name field accepts and displays 'Doe'
  4. Enter Postal Code: '12345'
    - expect: Postal Code field accepts and displays '12345'
  5. Click Continue button
    - expect: Form validation passes
    - expect: Page redirects to checkout-step-two.html
    - expect: No error messages appear

#### 2.2. Validate required field - First Name is mandatory

**File:** `tests/checkout/validation-first-name-required.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 with blank First Name field
    - expect: First Name field is empty
  2. Enter valid Last Name 'Smith' and Postal Code '54321'
    - expect: Last Name and Postal Code fields are populated
  3. Click Continue button without filling First Name
    - expect: Error message displays: 'Error: First Name is required'
    - expect: Error message appears as heading element
    - expect: Page remains on checkout step 1
    - expect: Error icon appears next to First Name field

#### 2.3. Validate required field - Last Name is mandatory

**File:** `tests/checkout/validation-last-name-required.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 with blank Last Name field
    - expect: Last Name field is empty
  2. Enter valid First Name 'Sarah' and Postal Code '98765'
    - expect: First Name and Postal Code fields are populated
  3. Click Continue button without filling Last Name
    - expect: Error message displays: 'Error: Last Name is required'
    - expect: Error message appears as heading element
    - expect: Page remains on checkout step 1
    - expect: Error icon appears next to Last Name field

#### 2.4. Validate required field - Postal Code is mandatory

**File:** `tests/checkout/validation-postal-code-required.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 with blank Postal Code field
    - expect: Postal Code field is empty
  2. Enter valid First Name 'Michael' and Last Name 'Johnson'
    - expect: First Name and Last Name fields are populated
  3. Click Continue button without filling Postal Code
    - expect: Error message displays: 'Error: Postal Code is required'
    - expect: Error message appears as heading element
    - expect: Page remains on checkout step 1
    - expect: Error icon appears next to Postal Code field

#### 2.5. Validate all fields are required - submit empty form

**File:** `tests/checkout/validation-all-fields-empty.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: All three input fields are empty
  2. Click Continue button with all fields empty
    - expect: Page remains on checkout step 1
    - expect: First error message appears: 'Error: First Name is required'
    - expect: Form prevents submission

#### 2.6. Accept special characters in name fields

**File:** `tests/checkout/special-characters-in-names.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form is loaded
  2. Enter First Name with special characters: '@#$%^&*()'
    - expect: Field accepts special characters without error
  3. Enter Last Name with special characters: '!<>?{}|'
    - expect: Field accepts special characters without error
  4. Enter Postal Code: '12345'
    - expect: Postal Code field accepts numeric value
  5. Click Continue button
    - expect: Form accepts special characters and proceeds to step 2

#### 2.7. Numeric values accepted in First and Last Name fields

**File:** `tests/checkout/numeric-values-in-names.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form is loaded
  2. Enter First Name: '123'
    - expect: Field accepts numeric value
  3. Enter Last Name: '456'
    - expect: Field accepts numeric value
  4. Enter Postal Code: '78901'
    - expect: Postal Code field accepts value
  5. Click Continue button
    - expect: Form accepts numeric values and proceeds to step 2

#### 2.8. Cancel button on checkout step 1 returns to cart

**File:** `tests/checkout/cancel-from-step1.spec.ts`

**Steps:**
  1. Login, add items to cart, and navigate to checkout step 1
    - expect: Checkout: Your Information page displays
  2. Enter some information (e.g., First Name: 'Test')
    - expect: First Name field contains 'Test'
  3. Click Cancel button
    - expect: User is redirected to inventory page
    - expect: Page URL changes to inventory.html
    - expect: Cart items are preserved (cart badge still shows items)

#### 2.9. Long string values in name fields

**File:** `tests/checkout/long-string-in-names.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form is loaded
  2. Enter First Name with 100+ characters: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    - expect: Field accepts long string
  3. Enter Last Name with 100+ characters
    - expect: Field accepts long string
  4. Enter Postal Code: '12345'
    - expect: Form proceeding
  5. Click Continue button
    - expect: Form submission succeeds (or field is truncated)
    - expect: Page progresses or shows appropriate message

#### 2.10. Single character values in fields

**File:** `tests/checkout/single-char-values.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form is loaded
  2. Enter First Name: 'A'
    - expect: Single character 'A' is accepted
  3. Enter Last Name: 'B'
    - expect: Single character 'B' is accepted
  4. Enter Postal Code: '1'
    - expect: Single character '1' is accepted
  5. Click Continue button
    - expect: Form accepts single character values and proceeds

#### 2.11. Whitespace-only input fields validation

**File:** `tests/checkout/whitespace-only-input.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form is loaded
  2. Enter First Name with only spaces: '     '
    - expect: Whitespace is entered in field
  3. Enter Last Name: 'Smith'
    - expect: Last Name field populated
  4. Enter Postal Code: '12345'
    - expect: Postal Code field populated
  5. Click Continue button
    - expect: Behavior: Form may accept whitespace or reject as empty field (test depends on implementation)

### 3. Order Overview and Payment Information

**Seed:** `tests/seed.spec.ts`

#### 3.1. Display order summary with all items and calculations

**File:** `tests/checkout/order-summary-display.spec.ts`

**Steps:**
  1. Complete checkout information entry with valid data (First: 'John', Last: 'Doe', Postal: '12345')
    - expect: User advances to checkout step 2
  2. View the Checkout: Overview page
    - expect: Page displays 'Checkout: Overview' heading
    - expect: Overview page contains order summary section
  3. Verify items listed in order summary
    - expect: All items added to cart are displayed
    - expect: Each item shows quantity (QTY column)
    - expect: Each item shows description
    - expect: Each item shows individual price
  4. Verify price calculations on overview page
    - expect: Item total is calculated and displayed
    - expect: Tax amount is calculated and displayed
    - expect: Grand total is calculated and displayed

#### 3.2. Verify payment information display

**File:** `tests/checkout/payment-info-display.spec.ts`

**Steps:**
  1. Proceed to checkout step 2 (order overview)
    - expect: Checkout: Overview page displays
  2. Locate Payment Information section
    - expect: 'Payment Information:' label is visible
    - expect: Payment method 'SauceCard #31337' is displayed
  3. Verify payment card details
    - expect: Payment card number/identifier is shown
    - expect: Same payment method is displayed consistently

#### 3.3. Verify shipping information display

**File:** `tests/checkout/shipping-info-display.spec.ts`

**Steps:**
  1. Proceed to checkout step 2 (order overview)
    - expect: Checkout: Overview page displays
  2. Locate Shipping Information section
    - expect: 'Shipping Information:' label is visible
    - expect: Shipping method 'Free Pony Express Delivery!' is displayed
  3. Verify shipping details
    - expect: Shipping method is shown correctly
    - expect: Delivery information is clear

#### 3.4. Verify accurate subtotal calculation

**File:** `tests/checkout/subtotal-calculation.spec.ts`

**Steps:**
  1. Add specific items to cart: Backpack ($29.99) + Bike Light ($9.99) + Bolt T-Shirt ($15.99)
    - expect: Cart contains 3 items
  2. Complete checkout step 1 and proceed to step 2
    - expect: Order overview page displays
  3. Verify item total calculation
    - expect: Item total shows: $55.97 (sum of 29.99 + 9.99 + 15.99)
    - expect: Calculation is correct

#### 3.5. Verify accurate tax calculation

**File:** `tests/checkout/tax-calculation.spec.ts`

**Steps:**
  1. Add items to cart and proceed to order overview
    - expect: Order overview page displays
  2. Note the subtotal amount
    - expect: Subtotal is visible
  3. Verify tax calculation on order overview
    - expect: Tax is calculated as approximately 8% of subtotal
    - expect: Tax amount displays in 'Tax: $X.XX' format
    - expect: Tax is rounded to 2 decimal places

#### 3.6. Verify accurate total amount calculation

**File:** `tests/checkout/total-calculation.spec.ts`

**Steps:**
  1. Add items totaling $39.98 (Backpack + Bike Light) to cart
    - expect: Cart contains items
  2. Proceed to order overview stage
    - expect: Order overview page displays
  3. Verify total calculation
    - expect: Item total: $39.98
    - expect: Tax (8%): $3.20
    - expect: Total: $43.18 (39.98 + 3.20)
    - expect: All calculations are mathematically correct

#### 3.7. Cancel from checkout overview returns to inventory

**File:** `tests/checkout/cancel-from-step2.spec.ts`

**Steps:**
  1. Proceed to checkout step 2 (order overview)
    - expect: Checkout: Overview page displays with order summary
  2. Click Cancel button
    - expect: User is redirected to inventory page
    - expect: Page URL changes to inventory.html
    - expect: Cart items are preserved

#### 3.8. Multiple items with varying quantities display correctly

**File:** `tests/checkout/multiple-items-display.spec.ts`

**Steps:**
  1. Add multiple different items to cart (e.g., 3-4 different products)
    - expect: Cart badge shows total item count
  2. Proceed to checkout overview
    - expect: Order overview page displays
  3. Verify all items display correctly
    - expect: All items appear in the summary
    - expect: Each item shows quantity 1
    - expect: All individual prices are correct
    - expect: Order totals are accurate

### 4. Order Completion and Success

**Seed:** `tests/seed.spec.ts`

#### 4.1. Successful order completion with success message

**File:** `tests/checkout/successful-order-completion.spec.ts`

**Steps:**
  1. Login with standard_user / secret_sauce
    - expect: User successfully logged in
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to cart
    - expect: Cart contains 2 items
  3. Navigate to cart and click Checkout
    - expect: Checkout step 1 page displays
  4. Enter valid information: First Name 'John', Last Name 'Doe', Postal Code '12345'
    - expect: All fields are filled with valid data
  5. Click Continue button
    - expect: Proceeds to checkout step 2 (order overview)
  6. Review order summary
    - expect: Order overview displays correctly with items, prices, and totals
  7. Click Finish button
    - expect: Page redirects to checkout-complete.html
    - expect: Page displays 'Checkout: Complete!' heading
  8. Verify success message is displayed
    - expect: Success message displays: 'Thank you for your order!'
    - expect: Order dispatch message displays: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    - expect: Pony Express icon is visible

#### 4.2. Back Home button returns to inventory page

**File:** `tests/checkout/back-home-button.spec.ts`

**Steps:**
  1. Complete a full checkout process and reach order completion page
    - expect: Order completion page displays with success message
  2. Click Back Home button
    - expect: User is redirected to inventory page
    - expect: Page URL changes to inventory.html
    - expect: Product listing is displayed
    - expect: Cart is reset (cart badge may show 0)

#### 4.3. Order confirmation page displays all relevant information

**File:** `tests/checkout/order-confirmation-display.spec.ts`

**Steps:**
  1. Complete full checkout and reach confirmation page
    - expect: Checkout: Complete! page displays
  2. Verify confirmation page elements
    - expect: Page heading: 'Checkout: Complete!'
    - expect: Success heading: 'Thank you for your order!'
    - expect: Confirmation message is present
    - expect: Pony Express delivery image is displayed
    - expect: Back Home button is visible and clickable

#### 4.4. Order completion with various names and postal codes

**File:** `tests/checkout/completion-with-varied-data.spec.ts`

**Steps:**
  1. Complete checkout with varied name: First Name 'María', Last Name 'García', Postal Code '28001'
    - expect: Form accepts international characters
  2. Review order overview
    - expect: Order overview displays correctly
  3. Click Finish
    - expect: Order completes successfully
    - expect: Confirmation page displays

### 5. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 5.1. Invalid checkout information - empty fields error handling

**File:** `tests/checkout/invalid-empty-fields.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout information form displays
  2. Leave all fields empty and click Continue
    - expect: Form validation triggers
    - expect: Error message appears: 'Error: First Name is required'
    - expect: User remains on checkout step 1
  3. Fill First Name and leave other fields empty, then click Continue
    - expect: Different error appears: 'Error: Last Name is required'
  4. Fill First Name and Last Name, leave Postal Code empty, then click Continue
    - expect: Error appears: 'Error: Postal Code is required'

#### 5.2. Special characters handling in checkout form

**File:** `tests/checkout/special-characters-handling.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Enter First Name: '@#$%'
    - expect: Special characters are accepted
  3. Enter Last Name: '!<>?{}'
    - expect: Special characters are accepted
  4. Enter Postal Code: '12345'
    - expect: Numeric postal code is accepted
  5. Click Continue
    - expect: Form submission succeeds with special characters
    - expect: Proceeds to order overview

#### 5.3. Very long input strings handling

**File:** `tests/checkout/long-input-handling.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Enter First Name with 200+ characters
    - expect: Long string is handled (accepted or truncated gracefully)
  3. Enter Last Name with 200+ characters
    - expect: Long string is handled gracefully
  4. Enter Postal Code: '12345'
    - expect: Postal code is accepted
  5. Click Continue
    - expect: Form either accepts or rejects with appropriate handling

#### 5.4. Leading and trailing spaces in fields

**File:** `tests/checkout/spaces-in-fields.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Enter First Name with leading spaces: '  John'
    - expect: Spaces are entered
  3. Enter Last Name with trailing spaces: 'Doe  '
    - expect: Spaces are entered
  4. Enter Postal Code: '12345'
    - expect: Postal code is entered
  5. Click Continue
    - expect: Form processes with leading/trailing spaces

#### 5.5. Postal code with non-numeric characters

**File:** `tests/checkout/postal-code-format.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Enter First Name: 'John'
    - expect: First name accepted
  3. Enter Last Name: 'Doe'
    - expect: Last name accepted
  4. Enter Postal Code with letters and special characters: 'A1B2C3'
    - expect: Field accepts alphanumeric postal code format
  5. Click Continue
    - expect: Form accepts non-standard postal code format

#### 5.6. Back button navigation from checkout step 2

**File:** `tests/checkout/back-button-navigation.spec.ts`

**Steps:**
  1. Complete checkout step 1 and proceed to step 2
    - expect: Order overview page displays
  2. Click browser back button or Cancel button on order overview
    - expect: User navigates back
    - expect: Page redirects appropriately

#### 5.7. Verify error icons appear next to invalid fields

**File:** `tests/checkout/error-icons-display.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 with empty fields
    - expect: All fields are empty
  2. Click Continue button
    - expect: Error message appears: 'Error: First Name is required'
  3. Verify error indication on First Name field
    - expect: Error icon appears next to First Name field
    - expect: Error icon is visually distinct

#### 5.8. Form field recovery after validation error

**File:** `tests/checkout/field-recovery-after-error.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 and try to submit empty form
    - expect: Validation error appears
  2. Fill all required fields with valid data
    - expect: Fields populate correctly
  3. Click Continue
    - expect: Form submission succeeds
    - expect: User proceeds to step 2
    - expect: Error message disappears

### 6. Navigation and User Flow

**Seed:** `tests/seed.spec.ts`

#### 6.1. Complete checkout flow from inventory to completion

**File:** `tests/checkout/complete-flow.spec.ts`

**Steps:**
  1. Login as standard_user / secret_sauce
    - expect: Login succeeds, inventory page displays
  2. Select and add 2-3 items to cart from inventory
    - expect: Each item added shows Remove button
    - expect: Cart badge increments
  3. Navigate to shopping cart
    - expect: Cart page displays with added items
  4. Review cart items, quantities, and pricing
    - expect: All items display correctly with prices
  5. Click Checkout button
    - expect: Directed to checkout step 1 (Your Information)
  6. Fill checkout information: First Name, Last Name, Postal Code
    - expect: Form fields populate with values
  7. Click Continue
    - expect: Directed to checkout step 2 (Order Overview)
  8. Review order summary with items, prices, payment, and shipping info
    - expect: Order overview displays all relevant information
  9. Click Finish
    - expect: Directed to checkout complete page
  10. Verify success message and order confirmation
    - expect: 'Thank you for your order!' message displays
    - expect: Order dispatch information shows

#### 6.2. Cart page navigation - continue shopping returns to inventory

**File:** `tests/checkout/continue-shopping-flow.spec.ts`

**Steps:**
  1. Add items to cart and navigate to cart page
    - expect: Cart page displays
  2. Click Continue Shopping button
    - expect: User returns to inventory page
    - expect: Added items remain in cart
  3. Add more items to cart
    - expect: Additional items added successfully

#### 6.3. Cancel button on checkout step 1 preserves cart

**File:** `tests/checkout/cancel-preserves-cart.spec.ts`

**Steps:**
  1. Add items to cart and navigate to checkout step 1
    - expect: Checkout information page displays
  2. Click Cancel button
    - expect: User returns to inventory page
    - expect: Cart badge still shows items
    - expect: Items remain in cart
  3. Navigate back to cart
    - expect: All previously added items are present

#### 6.4. Browser back button functionality

**File:** `tests/checkout/browser-back-button.spec.ts`

**Steps:**
  1. Navigate through checkout flow: inventory → cart → checkout step 1 → step 2
    - expect: Each page loads successfully
  2. Use browser back button from step 2
    - expect: User can navigate backwards through the flow
  3. Use browser back button from step 1
    - expect: User can navigate back through checkout pages

#### 6.5. Direct URL navigation to checkout pages

**File:** `tests/checkout/direct-url-navigation.spec.ts`

**Steps:**
  1. Login and add items to cart
    - expect: Cart has items
  2. Navigate directly to checkout-step-one.html via URL
    - expect: Checkout step 1 page loads
    - expect: Form displays
  3. Navigate directly to checkout-step-two.html via URL
    - expect: Page loads (may show empty if no checkout data in session)
  4. Complete checkout step 1 and navigate directly to checkout-complete.html
    - expect: Behavior depends on session state

### 7. UI Elements and Field Validation

**Seed:** `tests/seed.spec.ts`

#### 7.1. Verify all input field types and attributes

**File:** `tests/checkout/field-types-verification.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Inspect First Name input field
    - expect: Field type is text or similar input type
    - expect: Field has appropriate HTML attributes
    - expect: Field is labeled 'First Name'
  3. Inspect Last Name input field
    - expect: Field type is text
    - expect: Field is labeled 'Last Name'
  4. Inspect Postal Code input field
    - expect: Field type is text or number (depending on implementation)
    - expect: Field is labeled 'Zip/Postal Code'

#### 7.2. Verify buttons are clickable and properly labeled

**File:** `tests/checkout/button-verification.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Continue and Cancel buttons are visible
  2. Verify Continue button properties
    - expect: Button displays text 'Continue'
    - expect: Button is clickable
    - expect: Button has appropriate styling
  3. Verify Cancel button properties
    - expect: Button displays text 'Cancel'
    - expect: Button is clickable
    - expect: Cancel button has back icon
  4. Navigate to checkout step 2
    - expect: Finish and Cancel buttons are visible
  5. Verify Finish button properties
    - expect: Button displays text 'Finish'
    - expect: Button is clickable

#### 7.3. Verify cart badge displays correct count

**File:** `tests/checkout/cart-badge-count.spec.ts`

**Steps:**
  1. Start with empty cart
    - expect: Cart badge shows 0 or is not visible
  2. Add 1 item to cart
    - expect: Cart badge updates to show '1'
  3. Add 3 more items to cart
    - expect: Cart badge updates to show '4'
  4. Navigate to cart and remove 2 items
    - expect: Cart badge updates to show '2'

#### 7.4. Verify page titles and headings at each checkout step

**File:** `tests/checkout/page-titles-headings.spec.ts`

**Steps:**
  1. Navigate to cart page
    - expect: Page heading displays 'Your Cart'
  2. Click Checkout to proceed to step 1
    - expect: Page heading displays 'Checkout: Your Information'
  3. Complete step 1 and proceed to step 2
    - expect: Page heading displays 'Checkout: Overview'
  4. Complete step 2 and proceed to completion
    - expect: Page heading displays 'Checkout: Complete!'

#### 7.5. Verify error message formatting and display

**File:** `tests/checkout/error-message-formatting.spec.ts`

**Steps:**
  1. Navigate to checkout step 1 with empty fields
    - expect: Form is empty
  2. Click Continue to trigger First Name error
    - expect: Error message displays in heading format (h3 or similar)
    - expect: Error message text: 'Error: First Name is required'
    - expect: Error message is visually distinct and prominent
  3. Fill First Name and trigger Last Name error
    - expect: Error message updates to: 'Error: Last Name is required'
    - expect: Previous error disappears

#### 7.6. Verify field focus and input behavior

**File:** `tests/checkout/field-focus-behavior.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Click on First Name field
    - expect: Field receives focus
    - expect: Field is ready for input
  3. Type in First Name field
    - expect: Characters appear in field
  4. Press Tab to move to Last Name field
    - expect: Focus moves to Last Name field
    - expect: First Name field loses focus
  5. Type in Last Name field
    - expect: Characters appear in field

### 8. Accessibility and Cross-Browser Compatibility

**Seed:** `tests/seed.spec.ts`

#### 8.1. Checkout flow on Chrome browser

**File:** `tests/checkout/chrome-compatibility.spec.ts`

**Steps:**
  1. Launch application in Chrome browser
    - expect: Application loads correctly
  2. Complete full checkout flow from login to completion
    - expect: All elements display correctly
    - expect: Form submission works
    - expect: Navigation functions properly
  3. Verify styling and layout in Chrome
    - expect: Page layout is clean and organized
    - expect: All buttons and links are clickable
    - expect: Form fields are visible and usable

#### 8.2. Checkout flow on Firefox browser

**File:** `tests/checkout/firefox-compatibility.spec.ts`

**Steps:**
  1. Launch application in Firefox browser
    - expect: Application loads correctly
  2. Complete full checkout flow
    - expect: All elements function properly
    - expect: Form submission succeeds
    - expect: Navigation works correctly

#### 8.3. Checkout flow on Safari browser

**File:** `tests/checkout/safari-compatibility.spec.ts`

**Steps:**
  1. Launch application in Safari browser
    - expect: Application loads correctly
  2. Complete full checkout flow
    - expect: All elements function properly in Safari
    - expect: Form validation works correctly
    - expect: Navigation is responsive

#### 8.4. Form labels are properly associated with input fields

**File:** `tests/checkout/form-accessibility-labels.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Check HTML structure for label associations
    - expect: 'First Name' label is associated with first input field
    - expect: 'Last Name' label is associated with second input field
    - expect: 'Zip/Postal Code' label is associated with third input field
  3. Click on field labels to verify they focus the correct input
    - expect: Clicking label focuses the corresponding input field

#### 8.5. Error messages are screen-reader friendly

**File:** `tests/checkout/error-accessibility.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Form displays
  2. Trigger validation error by clicking Continue with empty fields
    - expect: Error message appears
  3. Check error message structure
    - expect: Error displays as heading element for screen reader recognition
    - expect: Error text is clear and descriptive

#### 8.6. Keyboard navigation through checkout form

**File:** `tests/checkout/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Checkout form displays
  2. Use Tab key to navigate through form fields
    - expect: Tab key moves focus from First Name → Last Name → Postal Code → Continue button → Cancel button
    - expect: Tab order is logical
  3. Use Shift+Tab to navigate backwards
    - expect: Focus moves backwards through elements correctly
  4. Press Enter on Continue button when focused
    - expect: Form submission is triggered
