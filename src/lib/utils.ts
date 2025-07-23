import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// User credentials for testing/development
export const validCredentials = [
    {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    },
    // Additional test users can be added here
    {
        id: '2',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User'
    }
];

// Helper to verify credentials
export function verifyCredentials(email: string, password: string) {
    return validCredentials.find((user) => user.email === email && user.password === password);
}
