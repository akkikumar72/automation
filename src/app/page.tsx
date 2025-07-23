'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '~/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from '~/components/ui/navigation-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export default function Home() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [editTodo, setEditTodo] = useState<Todo | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [todoTitle, setTodoTitle] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
            fetchTodos(token);
        }
        setLoading(false);
    }, []);

    const fetchTodos = async (token: string) => {
        try {
            const res = await fetch('/api/items', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTodos(data);
            }
        } catch (error) {
            console.error('Failed to fetch todos', error);
            toast.error('Failed to fetch todos');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setTodos([]);
        router.refresh();
        toast.success('Logged out successfully');
    };

    const openAddDialog = () => {
        setTodoTitle('');
        setEditTodo(null);
        setFormError('');
        setIsDialogOpen(true);
    };

    const openEditDialog = (todo: Todo) => {
        setTodoTitle(todo.title);
        setEditTodo(todo);
        setFormError('');
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');

        const token = localStorage.getItem('token');
        if (!token) return;

        if (!todoTitle.trim()) {
            setFormError('Title is required');
            return;
        }

        try {
            if (editTodo) {
                // Update
                const res = await fetch(`/api/items/${editTodo.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: todoTitle })
                });
                if (res.ok) {
                    const updated = await res.json();
                    setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
                    toast.success('Todo updated successfully');
                } else {
                    toast.error('Failed to update todo');
                }
            } else {
                // Add
                const res = await fetch('/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ title: todoTitle })
                });
                if (res.ok) {
                    const newTodo = await res.json();
                    setTodos([...todos, newTodo]);
                    toast.success('Todo added successfully');
                } else {
                    toast.error('Failed to add todo');
                }
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving todo', error);
            setFormError('Failed to save todo');
            toast.error('Failed to save todo');
        }
    };

    const toggleCompleted = async (id: number, completed: boolean) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ completed })
            });
            if (res.ok) {
                const updated = await res.json();
                setTodos(todos.map((t) => (t.id === id ? updated : t)));
                toast.success(completed ? 'Todo marked as completed' : 'Todo marked as incomplete');
            } else {
                toast.error('Failed to update todo status');
            }
        } catch (error) {
            console.error('Error updating completed', error);
            toast.error('Failed to update todo status');
        }
    };

    const deleteTodo = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTodos(todos.filter((t) => t.id !== id));
                toast.success('Todo deleted successfully');
            } else {
                toast.error('Failed to delete todo');
            }
        } catch (error) {
            console.error('Error deleting todo', error);
            toast.error('Failed to delete todo');
        }
    };

    if (loading)
        return (
            <div className='loading-gradient flex h-screen w-full items-center justify-center'>
                <div className='text-lg font-medium text-[rgb(var(--primary-color))]'>Loading...</div>
            </div>
        );

    return (
        <div className='flex min-h-screen flex-col'>
            <header className='sticky top-0 flex h-14 items-center border-b bg-white/60 to-white/60 px-4 text-white backdrop-blur-md dark:bg-background/80'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href='/' className='text-lg font-medium text-purple-900'>
                                    TaskFlow
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <div className='ml-auto flex items-center space-x-4'>
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar data-testid='user-avatar' className='cursor-pointer'>
                                    <AvatarFallback className='bg-white text-purple-600'>
                                        {user?.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem data-testid='logout-button' onClick={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button asChild variant='default' className='button-gradient border-none'>
                            <Link href='/login'>Login</Link>
                        </Button>
                    )}
                </div>
            </header>

            <main className='flex-1'>
                {!isLoggedIn ? (
                    <div className='flex flex-col items-center px-4 py-12 text-center md:py-20'>
                        <p className='mb-2 text-sm font-medium text-purple-600'>Organize with purpose</p>
                        <h1 className='mb-6 text-4xl font-bold text-purple-900 md:text-6xl'>
                            Smart tasks, <br className='md:hidden' /> real progress, <br />
                            visible results
                        </h1>
                        <p className='mb-8 max-w-2xl text-gray-600'>
                            At TaskFlow, we take your to-dos and turn them into completed achievements. Whether it's
                            simple daily tasks, work projects, or personal goals, we make organizing simple and getting
                            things done satisfying.
                        </p>
                        <Button asChild size='lg' className='button-gradient border-none px-6'>
                            <Link href='/login'>Get Started</Link>
                        </Button>

                        <div className='mt-16 w-full max-w-5xl'>
                            <Image
                                src='/home_hero-section.webp'
                                alt='Team collaborating'
                                width={1000}
                                height={600}
                                className='w-full'
                                priority
                            />
                        </div>
                    </div>
                ) : (
                    <div className='mx-auto max-w-4xl p-6'>
                        <div className='mb-8'>
                            <h1 className='text-3xl font-bold text-purple-900'>Hello, {user?.name}</h1>
                            <p className='text-gray-600'>Manage your tasks and stay productive</p>
                        </div>

                        <div className='card-gradient mb-6 rounded-xl p-6 shadow-lg'>
                            <div className='mb-4 flex items-center justify-between'>
                                <h2 className='text-xl font-semibold text-purple-900'>My Tasks</h2>
                                <Button
                                    data-testid='add-todo-button'
                                    onClick={openAddDialog}
                                    className='button-gradient border-none'>
                                    Add Task
                                </Button>
                            </div>

                            {todos.length > 0 ? (
                                <Table data-testid='todos-table'>
                                    <TableHeader>
                                        <TableRow className='bg-[rgba(var(--primary-color),0.05)]'>
                                            <TableHead>Completed</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {todos.map((todo) => (
                                            <TableRow
                                                key={todo.id}
                                                data-testid={`todo-row-${todo.id}`}
                                                className={todo.completed ? 'bg-[rgba(var(--success),0.05)]' : ''}>
                                                <TableCell>
                                                    <Checkbox
                                                        data-testid={`todo-checkbox-${todo.id}`}
                                                        checked={todo.completed}
                                                        onCheckedChange={(checked) =>
                                                            toggleCompleted(todo.id, !!checked)
                                                        }
                                                        className='border-purple-400 text-[rgb(var(--primary-color))]'
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    data-testid={`todo-title-${todo.id}`}
                                                    className={todo.completed ? 'text-gray-400 line-through' : ''}>
                                                    {todo.title}
                                                </TableCell>
                                                <TableCell className='flex space-x-2'>
                                                    <Button
                                                        data-testid={`todo-edit-${todo.id}`}
                                                        variant='outline'
                                                        size='sm'
                                                        onClick={() => openEditDialog(todo)}
                                                        className='border-[rgba(var(--primary-color),0.3)] text-[rgb(var(--primary-color))] hover:bg-[rgba(var(--primary-color),0.05)]'>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        data-testid={`todo-delete-${todo.id}`}
                                                        variant='destructive'
                                                        size='sm'
                                                        onClick={() => deleteTodo(todo.id)}
                                                        className='bg-[rgb(var(--error))] bg-opacity-90 hover:bg-[rgb(var(--error))] hover:bg-opacity-100'>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div
                                    data-testid='empty-todo-state'
                                    className='empty-state rounded-lg p-8 py-10 text-center'>
                                    <p className='text-gray-500'>No tasks yet. Add your first task to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent data-testid='todo-dialog' className='rounded-lg'>
                        <DialogHeader>
                            <DialogTitle>{editTodo ? 'Edit Task' : 'Add Task'}</DialogTitle>
                            <DialogDescription>
                                {editTodo ? 'Update your task details.' : 'Create a new task to track.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form data-testid='todo-form' onSubmit={handleSubmit} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='title'>Task Title</Label>
                                <Input
                                    data-testid='todo-title-input'
                                    id='title'
                                    value={todoTitle}
                                    onChange={(e) => setTodoTitle(e.target.value)}
                                    required
                                    className='border-[rgba(var(--primary-color),0.2)] focus:border-[rgba(var(--primary-color),0.5)] focus:ring-[rgba(var(--primary-color),0.3)]'
                                />
                                {formError && (
                                    <p data-testid='form-error' className='text-sm text-red-500'>
                                        {formError}
                                    </p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    data-testid='todo-submit-button'
                                    type='submit'
                                    className='button-gradient border-none'>
                                    {editTodo ? 'Update' : 'Add'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>

            <footer className='footer-gradient mt-auto py-4 text-center text-sm text-gray-600'>
                <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
            </footer>
        </div>
    );
}
