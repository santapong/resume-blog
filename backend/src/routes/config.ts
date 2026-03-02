import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/config — Get site configuration
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        let config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
        if (!config) {
            config = await prisma.siteConfig.create({
                data: {
                    heroTitle: 'Software & Automation Engineer',
                    heroSubtitle: 'Forging digital solutions in the fires of innovation',
                    aboutText: '',
                },
            });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch configuration.' });
    }
});

// PUT /api/config — Update site configuration (auth required)
router.put('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { heroTitle, heroSubtitle, aboutText } = req.body;
        const data: Record<string, unknown> = {};
        if (heroTitle !== undefined) data.heroTitle = heroTitle;
        if (heroSubtitle !== undefined) data.heroSubtitle = heroSubtitle;
        if (aboutText !== undefined) data.aboutText = aboutText;

        const config = await prisma.siteConfig.upsert({
            where: { id: 1 },
            update: data,
            create: {
                heroTitle: heroTitle || 'Software & Automation Engineer',
                heroSubtitle: heroSubtitle || '',
                aboutText: aboutText || '',
            },
        });
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update configuration.' });
    }
});

export { router as configRouter };
