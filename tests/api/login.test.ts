import { expect, test } from '@playwright/test';

test.describe('Login API', () => {
    const apiUrl = '/api/login';

    test('should login successfully with valid credentials', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                email: 'test@example.com',
                password: 'password123'
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.user).toBeDefined();
        expect(body.token).toBeDefined();
        expect(body.user.email).toBe('test@example.com');
    });

    test('should return 401 with invalid credentials', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                email: 'wrong@example.com',
                password: 'wrongpassword'
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.error).toBe('Invalid email or password');
    });

    test('should return 400 when email is missing', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                password: 'password123'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe('Email and password are required');
    });

    test('should return 400 when password is missing', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                email: 'test@example.com'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe('Email and password are required');
    });
});
