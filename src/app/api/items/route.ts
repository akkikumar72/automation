import { NextResponse } from 'next/server';
import { todoStore } from '~/lib/store';

// GET all todos
export async function GET(request: Request) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || token !== 'mock-jwt-token') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const todos = todoStore.getAll();
        return NextResponse.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST create a new todo
export async function POST(request: Request) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || token !== 'mock-jwt-token') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();
        const { title } = body;

        if (!title || typeof title !== 'string' || title.trim() === '') {
            return NextResponse.json({ error: 'Title is required and must be a non-empty string' }, { status: 400 });
        }

        const newTodo = todoStore.add(title.trim());

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
