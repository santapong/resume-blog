import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/skills — List all skills
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' },
        });
        const parsed = skills.map(skill => ({
            ...skill,
            items: JSON.parse(skill.items),
        }));
        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch skills.' });
    }
});

// POST /api/skills — Create skill (auth required)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, items, order } = req.body;
        const skill = await prisma.skill.create({
            data: {
                category,
                items: JSON.stringify(items || []),
                order: order || 0,
            },
        });
        res.status(201).json({ ...skill, items: JSON.parse(skill.items) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create skill.' });
    }
});

// PUT /api/skills/:id — Update skill (auth required)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, items, order } = req.body;
        const data: Record<string, unknown> = {};
        if (category !== undefined) data.category = category;
        if (items !== undefined) data.items = JSON.stringify(items);
        if (order !== undefined) data.order = order;

        const skill = await prisma.skill.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json({ ...skill, items: JSON.parse(skill.items) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update skill.' });
    }
});

// DELETE /api/skills/:id — Delete skill (auth required)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.skill.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Skill deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete skill.' });
    }
});

export { router as skillsRouter };
