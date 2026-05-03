import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

type Ctx = { params: Promise<{ idOrSlug: string }> };
const serialize = <T extends { tags: string }>(post: T) => ({ ...post, tags: JSON.parse(post.tags) });

export async function GET(_request: Request, { params }: Ctx) {
    try {
        const { idOrSlug } = await params;
        const post = await prisma.blogPost.findUnique({ where: { slug: idOrSlug } });
        if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
        return NextResponse.json(serialize(post));
    } catch {
        return NextResponse.json({ error: 'Failed to fetch post.' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { idOrSlug } = await params;
        const body = await request.json();
        const data: Record<string, unknown> = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.excerpt !== undefined) data.excerpt = body.excerpt;
        if (body.content !== undefined) data.content = body.content;
        if (body.tags !== undefined) data.tags = JSON.stringify(body.tags);
        if (body.published !== undefined) data.published = body.published;

        const post = await prisma.blogPost.update({ where: { id: parseInt(idOrSlug) }, data });
        return NextResponse.json(serialize(post));
    } catch {
        return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Ctx) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { idOrSlug } = await params;
        await prisma.blogPost.delete({ where: { id: parseInt(idOrSlug) } });
        return NextResponse.json({ message: 'Post deleted.' });
    } catch {
        return NextResponse.json({ error: 'Failed to delete post.' }, { status: 500 });
    }
}
