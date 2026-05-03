import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
        return NextResponse.json(experiences.map((e) => ({ ...e, technologies: JSON.parse(e.technologies) })));
    } catch {
        return NextResponse.json({ error: 'Failed to fetch experiences.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { title, company, period, description, technologies, order } = await request.json();
        const experience = await prisma.experience.create({
            data: {
                title,
                company,
                period,
                description,
                technologies: JSON.stringify(technologies || []),
                order: order || 0,
            },
        });
        return NextResponse.json({ ...experience, technologies: JSON.parse(experience.technologies) }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create experience.' }, { status: 500 });
    }
}
