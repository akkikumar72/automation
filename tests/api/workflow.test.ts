import { APIRequestContext, expect, test } from '@playwright/test';
import { Todo } from '~/lib/store';
import { validCredentials } from '~/lib/utils';

test.describe('API Workflow Tests', () => {
    const apiUrl = '/api/items';
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

    test('complete todo workflow', async ({ request }) => {
        const initialResponse = await request.get(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        expect(initialResponse.status()).toBe(200);

        const initialTodos = await initialResponse.json();

        const createTitle = `Workflow Test Todo ${Date.now()}`;
        const createResponse = await request.post(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: { title: createTitle }
        });

        expect(createResponse.status()).toBe(201);

        const createdTodo = (await createResponse.json()) as Todo;
        expect(createdTodo.title).toBe(createTitle);
        expect(createdTodo.completed).toBe(false);

        const todoId = createdTodo.id;

        const listAfterCreateResponse = await request.get(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const todosAfterCreate = (await listAfterCreateResponse.json()) as Todo[];

        expect(todosAfterCreate.some((todo: Todo) => todo.id === todoId)).toBe(true);

        const getTodoResponse = await request.get(`${apiUrl}/${todoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        expect(getTodoResponse.status()).toBe(200);

        const retrievedTodo = (await getTodoResponse.json()) as Todo;
        expect(retrievedTodo.id).toBe(todoId);
        expect(retrievedTodo.title).toBe(createTitle);

        const updateTitle = `Updated Workflow Todo ${Date.now()}`;
        const updateResponse = await request.put(`${apiUrl}/${todoId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: {
                title: updateTitle,
                completed: true
            }
        });

        expect(updateResponse.status()).toBe(200);

        const updatedTodo = (await updateResponse.json()) as Todo;
        expect(updatedTodo.id).toBe(todoId);
        expect(updatedTodo.title).toBe(updateTitle);
        expect(updatedTodo.completed).toBe(true);

        const listAfterUpdateResponse = await request.get(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const todosAfterUpdate = (await listAfterUpdateResponse.json()) as Todo[];

        const foundTodo = todosAfterUpdate.find((todo: Todo) => todo.id === todoId);
        expect(foundTodo).toBeDefined();
        expect(foundTodo?.title).toBe(updateTitle);
        expect(foundTodo?.completed).toBe(true);

        const deleteResponse = await request.delete(`${apiUrl}/${todoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        expect(deleteResponse.status()).toBe(200);

        const listAfterDeleteResponse = await request.get(apiUrl, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        const todosAfterDelete = (await listAfterDeleteResponse.json()) as Todo[];

        expect(todosAfterDelete.some((todo: Todo) => todo.id === todoId)).toBe(false);

        const getTodoAfterDeleteResponse = await request.get(`${apiUrl}/${todoId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        expect(getTodoAfterDeleteResponse.status()).toBe(404);
    });

    test('batch operations workflow', async ({ request }) => {
        const todos: Todo[] = [];

        for (let i = 0; i < 3; i++) {
            const createResponse = await request.post(apiUrl, {
                headers: { Authorization: `Bearer ${authToken}` },
                data: { title: `Batch Todo ${i} - ${Date.now()}` }
            });

            expect(createResponse.status()).toBe(201);
            todos.push((await createResponse.json()) as Todo);
        }

        for (const todo of todos) {
            const updateResponse = await request.put(`${apiUrl}/${todo.id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
                data: { completed: true }
            });

            expect(updateResponse.status()).toBe(200);
        }

        for (const todo of todos) {
            const getTodoResponse = await request.get(`${apiUrl}/${todo.id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const updatedTodo = (await getTodoResponse.json()) as Todo;

            expect(updatedTodo.completed).toBe(true);
        }

        for (const todo of todos) {
            const deleteResponse = await request.delete(`${apiUrl}/${todo.id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(deleteResponse.status()).toBe(200);
        }

        for (const todo of todos) {
            const getTodoResponse = await request.get(`${apiUrl}/${todo.id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(getTodoResponse.status()).toBe(404);
        }
    });
});
