import { expect, test } from '@playwright/test';
import { validCredentials } from '~/lib/utils';

test.describe('Landing Page', () => {
    // Get test user with fallback
    const testUser = validCredentials[0] ?? {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        id: '1'
    };

    test('should display landing page content when not logged in', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();

        await expect(page.getByRole('link', { name: 'TaskFlow', exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Login', exact: true })).toBeVisible();

        await expect(page.getByRole('img', { name: 'Team collaborating' })).toBeVisible();

        await expect(page.getByText(/© \d{4} TaskFlow/)).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: 'Login', exact: true }).click();
        await expect(page).toHaveURL('/login');

        await page.goto('/');

        await page.getByRole('link', { name: 'Get Started' }).click();
        await expect(page).toHaveURL('/login');
    });

    test('should show todo interface when logged in', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill(testUser.email);
        await page.getByLabel('Password').fill(testUser.password);
        await page.getByRole('button', { name: 'Login' }).click();

        await page.waitForTimeout(2000);

        await expect(page.locator('p', { hasText: 'Manage your tasks and stay productive' })).toBeVisible();
        await expect(page.getByText('My Tasks')).toBeVisible();

        await expect(page.getByText('Smart tasks, real progress, visible results')).not.toBeVisible();
    });
});
