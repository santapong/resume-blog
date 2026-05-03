import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        const body = await request.json();
        const data: Record<string, unknown> = {};
        if (body.category !== undefined) data.category = body.category;
        if (body.items !== undefined) data.items = JSON.stringify(body.items);
        if (body.order !== undefined) data.order = body.order;

        const skill = await prisma.skill.update({ where: { id: parseInt(id) }, data });
        return NextResponse.json({ ...skill, items: JSON.parse(skill.items) });
    } catch {
        return NextResponse.json({ error: 'Failed to update skill.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        await prisma.skill.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Skill deleted.' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete skill.' }, { status: 500 });
    }
}
