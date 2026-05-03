import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({ where: { id: parseInt(id) } });
        if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
        return NextResponse.json({ ...project, technologies: JSON.parse(project.technologies) });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch project.' }, { status: 500 });
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
        if (body.description !== undefined) data.description = body.description;
        if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl;
        if (body.liveUrl !== undefined) data.liveUrl = body.liveUrl;
        if (body.repoUrl !== undefined) data.repoUrl = body.repoUrl;
        if (body.technologies !== undefined) data.technologies = JSON.stringify(body.technologies);
        if (body.featured !== undefined) data.featured = body.featured;
        if (body.order !== undefined) data.order = body.order;

        const project = await prisma.project.update({ where: { id: parseInt(id) }, data });
        return NextResponse.json({ ...project, technologies: JSON.parse(project.technologies) });
    } catch {
        return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        await prisma.project.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Project deleted.' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
    }
}
