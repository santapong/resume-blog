import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `resume_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// GET /api/resume — Get active resume info
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const resume = await prisma.resume.findFirst({
            where: { isActive: true },
            orderBy: { uploadedAt: 'desc' },
        });
        if (!resume) {
            res.status(404).json({ error: 'No active resume found.' });
            return;
        }
        res.json({
            ...resume,
            url: `/uploads/resumes/${resume.filename}`,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resume.' });
    }
});

// GET /api/resume/download — Download active resume PDF
router.get('/download', async (_req: Request, res: Response): Promise<void> => {
    try {
        const resume = await prisma.resume.findFirst({
            where: { isActive: true },
            orderBy: { uploadedAt: 'desc' },
        });
        if (!resume) {
            res.status(404).json({ error: 'No active resume found.' });
            return;
        }
        const filePath = path.join(uploadsDir, resume.filename);
        res.download(filePath, 'Resume.pdf');
    } catch (error) {
        res.status(500).json({ error: 'Failed to download resume.' });
    }
});

// POST /api/resume — Upload new resume (auth required)
router.post('/', authenticateToken, upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded.' });
            return;
        }

        // Deactivate all previous resumes
        await prisma.resume.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });

        // Create new active resume
        const resume = await prisma.resume.create({
            data: {
                filename: req.file.filename,
                isActive: true,
            },
        });

        res.status(201).json({
            ...resume,
            url: `/uploads/resumes/${resume.filename}`,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload resume.' });
    }
});

export { router as resumeRouter };
