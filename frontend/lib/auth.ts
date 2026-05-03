import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'medieval-secret-key';

export function verifyToken(authHeader: string | null): { username: string } | null {
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET) as { username: string };
    } catch {
        return null;
    }
}

// Returns a 401 NextResponse if the request lacks a valid bearer token.
// Otherwise returns null and the caller proceeds.
export function requireAuth(request: Request): NextResponse | null {
    const decoded = verifyToken(request.headers.get('authorization'));
    if (!decoded) {
        return NextResponse.json({ error: 'Access denied. Invalid or missing token.' }, { status: 401 });
    }
    return null;
}

export function signToken(username: string): string {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
}
