import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/projects — List all projects
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' },
        });
        const parsed = projects.map(project => ({
            ...project,
            technologies: JSON.parse(project.technologies),
        }));
        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
});

// GET /api/projects/:id — Get single project
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found.' });
            return;
        }
        res.json({ ...project, technologies: JSON.parse(project.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project.' });
    }
});

// POST /api/projects — Create project (auth required)
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, imageUrl, liveUrl, repoUrl, technologies, featured, order } = req.body;
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
        res.status(201).json({ ...project, technologies: JSON.parse(project.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project.' });
    }
});

// PUT /api/projects/:id — Update project (auth required)
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, imageUrl, liveUrl, repoUrl, technologies, featured, order } = req.body;
        const data: Record<string, unknown> = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (imageUrl !== undefined) data.imageUrl = imageUrl;
        if (liveUrl !== undefined) data.liveUrl = liveUrl;
        if (repoUrl !== undefined) data.repoUrl = repoUrl;
        if (technologies !== undefined) data.technologies = JSON.stringify(technologies);
        if (featured !== undefined) data.featured = featured;
        if (order !== undefined) data.order = order;

        const project = await prisma.project.update({
            where: { id: parseInt(req.params.id) },
            data,
        });
        res.json({ ...project, technologies: JSON.parse(project.technologies) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

// DELETE /api/projects/:id — Delete project (auth required)
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        await prisma.project.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.json({ message: 'Project deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

export { router as projectsRouter };
