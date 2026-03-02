import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/experiences — List all experiences
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { order: 'asc' },
        });
        // Parse technologies JSON string back to array
        const parsed = experiences.map(exp => ({
            ...exp,
            technologies: JSON.parse(exp.technologies),
        }));
        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experiences.' });
    }
});

// GET /api/experiences/:id — Get single experience
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const experience = await prisma.experience.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!experience) {
            res.status(404).json({ error: 'Experience not found.' });
            return;
        }
        res.json({ ...experience, technologies: JSON.parse(experience.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experience.' });
    }
});

// POST /api/experiences — Create experience (auth required)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, company, period, description, technologies, order } = req.body;
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
        res.status(201).json({ ...experience, technologies: JSON.parse(experience.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create experience.' });
    }
});

// PUT /api/experiences/:id — Update experience (auth required)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, company, period, description, technologies, order } = req.body;
        const data: Record<string, unknown> = {};
        if (title !== undefined) data.title = title;
        if (company !== undefined) data.company = company;
        if (period !== undefined) data.period = period;
        if (description !== undefined) data.description = description;
        if (technologies !== undefined) data.technologies = JSON.stringify(technologies);
        if (order !== undefined) data.order = order;

        const experience = await prisma.experience.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json({ ...experience, technologies: JSON.parse(experience.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update experience.' });
    }
});

// DELETE /api/experiences/:id — Delete experience (auth required)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.experience.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Experience deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete experience.' });
    }
});

export { router as experiencesRouter };
