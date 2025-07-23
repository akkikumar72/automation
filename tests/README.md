# UI Testing Documentation

This folder contains automated tests for the TaskFlow application, organized by type.

## Test Structure

-   **UI Tests**: Browser-based UI tests for the front-end interface

    -   `e2e.test.ts`: Complete end-to-end user flows
    -   `landing.test.ts`: Landing page tests
    -   `login.test.ts`: Authentication tests
    -   `todos.test.ts`: CRUD operations for todos

-   **API Tests**: Backend API endpoint tests
    -   `items.test.ts`: Todo items API
    -   `login.test.ts`: Authentication API
    -   `workflow.test.ts`: Combined API workflows

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
pnpm playwright:test

# Run just the UI tests on Chromium
pnpm playwright:test:ui

# Run just the API tests
pnpm playwright:test:api

# Run tests in debug mode
pnpm playwright:test:debug

# Run tests with UI mode
pnpm playwright:test:interactive
```

## Test Best Practices

When writing or modifying tests, consider the following best practices:

1. **Use appropriate selectors**: Prefer role-based selectors where possible, falling back to more specific selectors when needed.

    - Good: `page.getByRole('button', { name: 'Login' })`
    - Good: `page.getByLabel('Email')`

2. **Wait for state changes**: After actions that cause state changes, add appropriate waits or expectations.

    - Example: `await page.waitForTimeout(500);` after form submissions

3. **Handle conditional UI states**: Check if certain elements exist before interacting with them.

    - Example: Checking if a table exists before trying to interact with its rows

4. **Add unique identifiers**: When creating test data, add timestamps or unique strings to verify later.

    - Example: `const newTodoText = 'Test new todo ' + Date.now();`

5. **Keep tests independent**: Each test should clean up after itself or work regardless of the state from previous tests.

## Known Issues & Workarounds

-   **Avatar/Dropdown Menu**: The dropdown menu avatar can be difficult to target. Use `page.locator('header .avatar')` for more reliable selection.

-   **Toast Messages**: Toast notifications may have slight text variations. Use `{ exact: false }` and partial text matching.

-   **Checkbox State**: Radix UI checkboxes may not immediately reflect state changes. Add longer waits or multiple checks.

## Debugging Failed Tests

When tests fail, check the HTML report for detailed logs and screenshots. You can also run tests in debug mode:

```bash
pnpm playwright:test:debug
```

Or use the interactive UI mode to step through tests:

```bash
pnpm playwright:test:interactive
```
