import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/socials — List all social links
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const socials = await prisma.socialLink.findMany({
            orderBy: { order: 'asc' },
        });
        res.json(socials);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch social links.' });
    }
});

// POST /api/socials — Create social link (auth required)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { platform, url, icon, order } = req.body;
        const social = await prisma.socialLink.create({
            data: {
                platform,
                url,
                icon: icon || '🔗',
                order: order || 0,
            },
        });
        res.status(201).json(social);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create social link.' });
    }
});

// PUT /api/socials/:id — Update social link (auth required)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { platform, url, icon, order } = req.body;
        const data: Record<string, unknown> = {};
        if (platform !== undefined) data.platform = platform;
        if (url !== undefined) data.url = url;
        if (icon !== undefined) data.icon = icon;
        if (order !== undefined) data.order = order;

        const social = await prisma.socialLink.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json(social);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update social link.' });
    }
});

// DELETE /api/socials/:id — Delete social link (auth required)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.socialLink.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Social link deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete social link.' });
    }
});

export { router as socialsRouter };
