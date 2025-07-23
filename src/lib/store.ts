// Todo type definition
export type Todo = {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};

// In-memory store for todos
class TodoStore {
    private todos: Todo[] = [];
    private nextId = 1;

    constructor() {
        // Initialize with some sample data
        this.add('Learn React');
        this.add('Learn Next.js');
        this.add('Build a todo app');
    }

    // Get all todos
    getAll(): Todo[] {
        return [...this.todos];
    }

    // Get todo by ID
    getById(id: number): Todo | undefined {
        return this.todos.find((todo) => todo.id === id);
    }

    // Add a new todo
    add(title: string): Todo {
        const now = new Date().toISOString();
        const newTodo: Todo = {
            id: this.nextId++,
            title,
            completed: false,
            createdAt: now,
            updatedAt: now
        };

        this.todos.push(newTodo);
        return newTodo;
    }

    // Update a todo
    update(id: number, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null {
        const index = this.todos.findIndex((todo) => todo.id === id);

        if (index === -1) {
            return null;
        }

        const updatedTodo = {
            ...this.todos[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.todos[index] = updatedTodo;
        return updatedTodo;
    }

    // Delete a todo
    delete(id: number): boolean {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter((todo) => todo.id !== id);
        return this.todos.length !== initialLength;
    }

    // Reset store (for testing)
    reset(): void {
        this.todos = [];
        this.nextId = 1;
        this.add('Learn React');
        this.add('Learn Next.js');
        this.add('Build a todo app');
    }
}

// Export a singleton instance
export const todoStore = new TodoStore();
