import { expect, test } from '@playwright/test';
import { validCredentials } from '~/lib/utils';

test.describe('Login Functionality', () => {
    // Get test users from utils with fallback
    const validUser = validCredentials[0] || {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        id: '1'
    };

    const invalidUser = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
    };

    test('should display login form', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('.font-semibold', { hasText: 'Sign in to your account to continue' })).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    });

    test('should show error on invalid login', async ({ page }) => {
        await page.goto('/login');

        await page.locator('#email').fill(invalidUser.email);
        await page.locator('#password').fill(invalidUser.password);
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await page.waitForTimeout(1000);

        const errorVisible =
            (await page.getByText('Login failed', { exact: false }).isVisible()) ||
            (await page.getByText('Invalid email or password').isVisible());
        expect(errorVisible).toBeTruthy();
    });

    test('should login with valid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Email').fill(validUser.email);
        await page.getByLabel('Password').fill(validUser.password);
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await page.waitForTimeout(2000);

        await expect(page.getByText('Hello', { exact: false })).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        await page.goto('/login');

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL('/login');
    });

    test('should navigate to register page from login page', async ({ page }) => {
        await page.goto('/login');

        await expect(page.getByText('Register')).toBeVisible();
    });
});
