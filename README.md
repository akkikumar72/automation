# Automation Specialist Challenge

## Features

-   Login/logout functionality
-   Todo management (create, read, update, delete)
-   REST API endpoints
-   Automated UI tests with Playwright
-   Automated API tests with Playwright


## Getting Started

### Prerequisites

-   Node.js 20.x
-   pnpm 10.x

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Running the Application

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Test Credentials

For testing purposes, use:

-   Email: `test@example.com`
-   Password: `password123`


## API Automation Tests

### Test Scenarios

1. **Login API Tests**

    - Login with valid credentials
    - Login with invalid credentials
    - Validation errors

2. **Todo API Tests**

    - Get all todos
    - Create a new todo
    - Get a specific todo
    - Update a todo
    - Delete a todo
    - Error handling

3. **API Workflow Tests**
    - Complete todo workflow (create, read, update, delete)
    - Batch operations

### Running API Tests

Run all API tests:

```bash
pnpm playwright:test tests/api/
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```



## Test Strategy

For a comprehensive overview of the testing approach, please refer to the [Test Strategy Document](./testPlan/test-strategy.md).
