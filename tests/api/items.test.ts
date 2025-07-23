import { APIRequestContext, expect, test } from '@playwright/test';
import { Todo } from '~/lib/store';
import { validCredentials } from '~/lib/utils';

test.describe('Todo API', () => {
    const apiUrl = '/api/items';
    let createdTodoId: number;
    let authToken: string;

    // Helper to get auth token
    async function getAuthToken(request: APIRequestContext) {
        const testUser = validCredentials[0] || {
            email: 'test@example.com',
            password: 'password123'
        };

        const response = await request.post('/api/login', {
            data: {
                email: testUser.email,
                password: testUser.password
            }
        });
        const body = await response.json();
        return body.token;
    }

    // Setup - get auth token before tests
    test.beforeAll(async ({ request }) => {
        authToken = await getAuthToken(request);
    });

    test('should get all todos', async ({ request }) => {
        const response = await request.get(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status()).toBe(200);

        const body = (await response.json()) as Todo[];
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);

        const firstTodo = body[0];
        expect(firstTodo).toBeDefined();
        if (firstTodo) {
            expect(firstTodo.id).toBeDefined();
            expect(firstTodo.title).toBeDefined();
            expect(firstTodo.completed).toBeDefined();
            expect(firstTodo.createdAt).toBeDefined();
            expect(firstTodo.updatedAt).toBeDefined();
        }
    });

    test('should create a new todo', async ({ request }) => {
        const title = `Test Todo ${Date.now()}`;

        const response = await request.post(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                title
            }
        });

        expect(response.status()).toBe(201);

        const body = (await response.json()) as Todo;
        expect(body.title).toBe(title);
        expect(body.completed).toBe(false);
        expect(body.id).toBeDefined();

        createdTodoId = body.id;
    });

    test('should return 400 when creating todo with empty title', async ({ request }) => {
        const response = await request.post(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                title: ''
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBeDefined();
    });

    test('should get a specific todo by ID', async ({ request }) => {
        test.skip(!createdTodoId, 'No todo created yet');

        const response = await request.get(`${apiUrl}/${createdTodoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status()).toBe(200);

        const body = (await response.json()) as Todo;
        expect(body.id).toBe(createdTodoId);
    });

    test('should update a todo', async ({ request }) => {
        test.skip(!createdTodoId, 'No todo created yet');

        const updatedTitle = `Updated Todo ${Date.now()}`;

        const response = await request.put(`${apiUrl}/${createdTodoId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                title: updatedTitle,
                completed: true
            }
        });

        expect(response.status()).toBe(200);

        const body = (await response.json()) as Todo;
        expect(body.id).toBe(createdTodoId);
        expect(body.title).toBe(updatedTitle);
        expect(body.completed).toBe(true);
    });

    test('should return 404 when updating non-existent todo', async ({ request }) => {
        const nonExistentId = 9999;

        const response = await request.put(`${apiUrl}/${nonExistentId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                title: 'This should fail',
                completed: true
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.error).toBeDefined();
    });

    test('should delete a todo', async ({ request }) => {
        test.skip(!createdTodoId, 'No todo created yet');

        const response = await request.delete(`${apiUrl}/${createdTodoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.success).toBe(true);

        const getResponse = await request.get(`${apiUrl}/${createdTodoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        expect(getResponse.status()).toBe(404);
    });

    test('should return 404 when deleting non-existent todo', async ({ request }) => {
        const nonExistentId = 9999;

        const response = await request.delete(`${apiUrl}/${nonExistentId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.error).toBeDefined();
    });
});
