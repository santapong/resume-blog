import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
    try {
        const { id } = await params;
        const experience = await prisma.experience.findUnique({ where: { id: parseInt(id) } });
        if (!experience) return NextResponse.json({ error: 'Experience not found.' }, { status: 404 });
        return NextResponse.json({ ...experience, technologies: JSON.parse(experience.technologies) });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch experience.' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        const body = await request.json();
        const data: Record<string, unknown> = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.company !== undefined) data.company = body.company;
        if (body.period !== undefined) data.period = body.period;
        if (body.description !== undefined) data.description = body.description;
        if (body.technologies !== undefined) data.technologies = JSON.stringify(body.technologies);
        if (body.order !== undefined) data.order = body.order;

        const experience = await prisma.experience.update({ where: { id: parseInt(id) }, data });
        return NextResponse.json({ ...experience, technologies: JSON.parse(experience.technologies) });
    } catch {
        return NextResponse.json({ error: 'Failed to update experience.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        await prisma.experience.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Experience deleted.' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete experience.' }, { status: 500 });
    }
}
