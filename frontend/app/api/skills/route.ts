import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(skills.map((s) => ({ ...s, items: JSON.parse(s.items) })));
    } catch {
        return NextResponse.json({ error: 'Failed to fetch skills.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { category, items, order } = await request.json();
        const skill = await prisma.skill.create({
            data: { category, items: JSON.stringify(items || []), order: order || 0 },
        });
        return NextResponse.json({ ...skill, items: JSON.parse(skill.items) }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create skill.' }, { status: 500 });
    }
}
