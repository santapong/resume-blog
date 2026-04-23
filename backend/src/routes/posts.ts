import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const serialize = (post: { tags: string } & Record<string, unknown>) => ({
    ...post,
    tags: JSON.parse(post.tags),
});

// GET /api/posts — List posts. Defaults to published only; ?all=1 returns drafts too (auth required elsewhere if exposed).
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const includeDrafts = req.query.all === '1';
        const posts = await prisma.blogPost.findMany({
            where: includeDrafts ? undefined : { published: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(posts.map(serialize));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
});

// GET /api/posts/:slug — Get single post by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug: req.params.slug },
        });
        if (!post) {
            res.status(404).json({ error: 'Post not found.' });
            return;
        }
        res.json(serialize(post));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post.' });
    }
});

// POST /api/posts — Create post (auth required)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, slug, excerpt, content, tags, published } = req.body;
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
        res.status(201).json(serialize(post));
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post.' });
    }
});

// PUT /api/posts/:id — Update post (auth required)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, slug, excerpt, content, tags, published } = req.body;
        const data: Record<string, unknown> = {};
        if (title !== undefined) data.title = title;
        if (slug !== undefined) data.slug = slug;
        if (excerpt !== undefined) data.excerpt = excerpt;
        if (content !== undefined) data.content = content;
        if (tags !== undefined) data.tags = JSON.stringify(tags);
        if (published !== undefined) data.published = published;

        const post = await prisma.blogPost.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json(serialize(post));
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post.' });
    }
});

// DELETE /api/posts/:id — Delete post (auth required)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.blogPost.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Post deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post.' });
    }
});

export { router as postsRouter };
