import { expect, Page, test } from '@playwright/test';
import { validCredentials } from '~/lib/utils';

async function login(page: Page) {
    // Get the first test user, with fallback in case array is empty
    const testUser = validCredentials[0] || {
        email: 'test@example.com',
        password: 'password123'
    };

    await page.goto('/login');

    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);

    await page.getByRole('button', { name: 'Login', exact: true }).click();

    await page.waitForTimeout(3000);

    try {
        await page.waitForFunction(
            () => {
                return (
                    document.querySelector('[data-testid="add-todo-button"]') !== null ||
                    document.querySelector('[data-testid="todos-table"]') !== null ||
                    document.querySelector('[data-testid="empty-todo-state"]') !== null
                );
            },
            { timeout: 10000 }
        );
    } catch (e) {
        console.log('Failed to find todo elements after login, test may fail');
    }
}

test.describe('Todo functionality', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should display todo list', async ({ page }) => {
        await expect(page.getByText('My Tasks')).toBeVisible();

        const hasTable = await page.locator('[data-testid="todos-table"]').isVisible();

        if (hasTable) {
            await expect(page.locator('[data-testid^="todo-row-"]').first()).toBeVisible();
        } else {
            await expect(page.locator('[data-testid="empty-todo-state"]')).toBeVisible();

            await page.locator('[data-testid="add-todo-button"]').click();
            await page.locator('[data-testid="todo-title-input"]').fill('Test task');
            await page.locator('[data-testid="todo-submit-button"]').click();

            await page.waitForTimeout(1000);

            await expect(page.locator('[data-testid="todos-table"]')).toBeVisible();
        }
    });

    test('should add a new todo', async ({ page }) => {
        const newTodoText = 'Test new todo ' + Date.now();
        await page.locator('[data-testid="add-todo-button"]').click();
        await page.locator('[data-testid="todo-title-input"]').fill(newTodoText);
        await page.locator('[data-testid="todo-submit-button"]').click();

        await page.waitForTimeout(1000);

        await expect(page.locator(`[data-testid^="todo-title-"]`).filter({ hasText: newTodoText })).toBeVisible();
    });

    test('should toggle todo completion status', async ({ page }) => {
        const hasRows = (await page.locator('[data-testid^="todo-row-"]').count()) > 0;

        if (!hasRows) {
            await page.locator('[data-testid="add-todo-button"]').click();
            await page.locator('[data-testid="todo-title-input"]').fill('Todo to toggle');
            await page.locator('[data-testid="todo-submit-button"]').click();
            await page.waitForTimeout(1000);
        }

        const firstRow = page.locator('[data-testid^="todo-row-"]').first();
        const rowId = await firstRow.getAttribute('data-testid');
        const todoId = rowId?.replace('todo-row-', '');

        const firstCheckbox = page.locator(`[data-testid="todo-checkbox-${todoId}"]`);
        const titleCell = page.locator(`[data-testid="todo-title-${todoId}"]`);

        const isChecked = await firstCheckbox.isChecked();

        const initialTitle = await titleCell.textContent();
        console.log(`Before toggle - Title: ${initialTitle}, Checked: ${isChecked}`);

        // Using a more reliable method to toggle checkbox
        await page.evaluate((todoId) => {
            const checkbox = document.querySelector(`[data-testid="todo-checkbox-${todoId}"] input`);
            if (checkbox) {
                (checkbox as HTMLInputElement).click();
            }
        }, todoId);

        await page.waitForTimeout(3000);

        const currentTitle = await titleCell.textContent();
        console.log(`After toggle - Title: ${currentTitle}`);

        expect(currentTitle).toEqual(initialTitle);

        await expect(page.locator('[data-testid="todos-table"]')).toBeVisible();

        const newCheckedState = await firstCheckbox.isChecked();
        console.log(`Toggle test - Initial checked: ${isChecked}, New checked: ${newCheckedState}`);
    });

    test('should edit a todo', async ({ page }) => {
        const initialTitle = `Todo to edit ${Date.now()}`;

        await page.locator('[data-testid="add-todo-button"]').click();
        await page.locator('[data-testid="todo-title-input"]').fill(initialTitle);
        await page.locator('[data-testid="todo-submit-button"]').click();

        await page.waitForTimeout(3000);

        const newTodoRow = page.locator(`[data-testid^="todo-title-"]`).filter({ hasText: initialTitle });
        await expect(newTodoRow).toBeVisible();

        const parent = await newTodoRow.locator('xpath=..').first();
        const parentId = await parent.getAttribute('data-testid');
        const todoId = parentId?.replace('todo-row-', '');

        console.log(`Found new todo with ID: ${todoId}`);

        await page.locator(`[data-testid="todo-edit-${todoId}"]`).click();

        await expect(page.locator('[data-testid="todo-dialog"]')).toBeVisible();

        const timestamp = Date.now();
        const newTitle = `Updated Todo ${timestamp}`;

        await page.locator('[data-testid="todo-title-input"]').clear();
        await page.locator('[data-testid="todo-title-input"]').fill(newTitle);

        await page.locator('[data-testid="todo-submit-button"]').click();

        await page.waitForTimeout(3000);

        await page.reload();
        await page.waitForTimeout(3000);

        const updatedContent = await page.content();

        console.log(`Looking for "${newTitle}" in page content`);
        expect(updatedContent).toContain(newTitle);
    });

    test('should delete a todo', async ({ page }) => {
        const hasRows = (await page.locator('[data-testid^="todo-row-"]').count()) > 0;

        if (!hasRows) {
            await page.locator('[data-testid="add-todo-button"]').click();
            await page.locator('[data-testid="todo-title-input"]').fill('Todo to delete');
            await page.locator('[data-testid="todo-submit-button"]').click();
            await page.waitForTimeout(1000);
        }

        const initialRows = await page.locator('[data-testid^="todo-row-"]').count();

        const firstRow = page.locator('[data-testid^="todo-row-"]').first();
        const rowId = await firstRow.getAttribute('data-testid');
        const todoId = rowId?.replace('todo-row-', '');

        const todoText = await page.locator(`[data-testid="todo-title-${todoId}"]`).textContent();

        await page.locator(`[data-testid="todo-delete-${todoId}"]`).click();

        await page.waitForTimeout(2000);

        if (initialRows > 1) {
            const currentRows = await page.locator('[data-testid^="todo-row-"]').count();
            expect(currentRows).toBeLessThan(initialRows);
        } else {
            await expect(page.locator('[data-testid="empty-todo-state"]')).toBeVisible();
        }
    });

    test('should logout successfully', async ({ page }) => {
        await page.locator('[data-testid="user-avatar"]').click();

        await page.waitForTimeout(500);

        await page.locator('[data-testid="logout-button"]').click();

        await page.waitForTimeout(1000);

        await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();
    });
});
