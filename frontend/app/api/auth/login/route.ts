import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
        }

        if (username !== ADMIN_USERNAME) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!ok) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        return NextResponse.json({ token: signToken(username), message: 'Welcome to the castle, my lord! 🏰' });
    } catch {
        return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
    }
}
