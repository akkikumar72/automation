import { NextResponse } from 'next/server';
import { todoStore } from '~/lib/store';

// Helper function to validate and parse ID
function parseId(params: { id: string }): number | null {
    const id = parseInt(params.id, 10);
    return isNaN(id) ? null : id;
}

// GET a specific todo by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || token !== 'mock-jwt-token') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = parseId(params);

        if (id === null) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const todo = todoStore.getById(id);

        if (!todo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(todo);
    } catch (error) {
        console.error(`Error fetching todo ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT update a todo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || token !== 'mock-jwt-token') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = parseId(params);

        if (id === null) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const body = await request.json();
        const { title, completed } = body;

        // Validate at least one field is provided
        if ((title === undefined || title === null) && completed === undefined) {
            return NextResponse.json(
                { error: 'At least one field (title or completed) must be provided' },
                { status: 400 }
            );
        }

        // Validate title if provided
        if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
            return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 });
        }

        // Validate completed if provided
        if (completed !== undefined && typeof completed !== 'boolean') {
            return NextResponse.json({ error: 'Completed must be a boolean' }, { status: 400 });
        }

        // Create updates object with only the fields that are provided
        const updates: { title?: string; completed?: boolean } = {};
        if (title !== undefined) updates.title = title.trim();
        if (completed !== undefined) updates.completed = completed;

        const updatedTodo = todoStore.update(id, updates);

        if (!updatedTodo) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error(`Error updating todo ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE a todo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || token !== 'mock-jwt-token') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = parseId(params);

        if (id === null) {
            return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
        }

        const deleted = todoStore.delete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: `Todo ${id} deleted successfully` });
    } catch (error) {
        console.error(`Error deleting todo ${params.id}:`, error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
