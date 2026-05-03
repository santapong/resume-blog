import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const serialize = <T extends { tags: string }>(post: T) => ({ ...post, tags: JSON.parse(post.tags) });

export async function GET(request: Request) {
    try {
        const includeDrafts = new URL(request.url).searchParams.get('all') === '1';
        const posts = await prisma.blogPost.findMany({
            where: includeDrafts ? undefined : { published: true },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(posts.map(serialize));
    } catch {
        return NextResponse.json({ error: 'Failed to fetch posts.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { title, slug, excerpt, content, tags, published } = await request.json();
        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt: excerpt || null,
                content,
                tags: JSON.stringify(tags || []),
                published: published || false,
            },
        });
        return NextResponse.json(serialize(post), { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 });
    }
}
