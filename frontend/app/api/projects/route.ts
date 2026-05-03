import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(projects.map((p) => ({ ...p, technologies: JSON.parse(p.technologies) })));
    } catch {
        return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { title, description, imageUrl, liveUrl, repoUrl, technologies, featured, order } = await request.json();
        const project = await prisma.project.create({
            data: {
                title,
                description,
                imageUrl: imageUrl || null,
                liveUrl: liveUrl || null,
                repoUrl: repoUrl || null,
                technologies: JSON.stringify(technologies || []),
                featured: featured || false,
                order: order || 0,
            },
        });
        return NextResponse.json({ ...project, technologies: JSON.parse(project.technologies) }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create project.' }, { status: 500 });
    }
}
