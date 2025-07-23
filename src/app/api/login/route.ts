import { NextResponse } from 'next/server';
import { verifyCredentials } from '~/lib/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate request body
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Check credentials using the utility function
        const user = verifyCredentials(email, password);
        
        if (user) {
            // In a real app, you would generate a JWT token here
            return NextResponse.json(
                {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    },
                    token: 'mock-jwt-token'
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
