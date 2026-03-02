import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'medieval-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required.' });
            return;
        }

        if (username !== ADMIN_USERNAME) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, message: 'Welcome to the castle, my lord! 🏰' });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed.' });
    }
});

export { router as authRouter };
