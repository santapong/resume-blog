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
        if (body.platform !== undefined) data.platform = body.platform;
        if (body.url !== undefined) data.url = body.url;
        if (body.icon !== undefined) data.icon = body.icon;
        if (body.order !== undefined) data.order = body.order;

        const social = await prisma.socialLink.update({ where: { id: parseInt(id) }, data });
        return NextResponse.json(social);
    } catch {
        return NextResponse.json({ error: 'Failed to update social link.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { id } = await params;
        await prisma.socialLink.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ message: 'Social link deleted.' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete social link.' }, { status: 500 });
    }
}
