import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const socials = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(socials);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch social links.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { platform, url, icon, order } = await request.json();
        const social = await prisma.socialLink.create({
            data: { platform, url, icon: icon || '🔗', order: order || 0 },
        });
        return NextResponse.json(social, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create social link.' }, { status: 500 });
    }
}
