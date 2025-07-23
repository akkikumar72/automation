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

## API Endpoints

### Authentication

-   `POST /api/login` - Authenticate user
    -   Request body: `{ "email": "string", "password": "string" }`
    -   Response: `{ "success": true, "user": {...}, "token": "string" }`

### Todo Items

-   `GET /api/items` - Get all todos
-   `POST /api/items` - Create a new todo
    -   Request body: `{ "title": "string" }`
-   `GET /api/items/:id` - Get a specific todo
-   `PUT /api/items/:id` - Update a todo
    -   Request body: `{ "title": "string", "completed": boolean }`
-   `DELETE /api/items/:id` - Delete a todo

## UI Automation Tests

### Test Scenarios

1. **Login Tests**

    - Login with valid credentials
    - Login with invalid credentials
    - Display login form elements

2. **Todo Management Tests**

    - Display todo list
    - Add new todo
    - Toggle todo completion status
    - Edit todo
    - Delete todo

3. **End-to-End Flow Test**
    - Complete user journey from login to logout

### Running UI Tests

Run all UI tests:

```bash
pnpm playwright:test tests/login.test.ts tests/todos.test.ts tests/e2e.test.ts
```

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

Run specific API test files:

```bash
pnpm playwright:test tests/api/login.test.ts
pnpm playwright:test tests/api/items.test.ts
pnpm playwright:test tests/api/workflow.test.ts
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Test Credentials

For testing purposes, use:

-   Email: `test@example.com`
-   Password: `password123`


## Test Strategy

For a comprehensive overview of the testing approach, please refer to the [Test Strategy Document](./testPlan/test-strategy.md).
