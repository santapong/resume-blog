import express from 'express';
import cors from 'cors';
import path from 'path';
import { experiencesRouter } from './routes/experiences';
import { skillsRouter } from './routes/skills';
import { projectsRouter } from './routes/projects';
import { resumeRouter } from './routes/resume';
import { authRouter } from './routes/auth';
import { configRouter } from './routes/config';

const app = express();
const PORT = process.env.PORT || 12001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/experiences', experiencesRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/auth', authRouter);
app.use('/api/config', configRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'The castle stands strong! ⚔️' });
});

app.listen(PORT, () => {
    console.log(`🏰 Medieval Backend running on port ${PORT}`);
});

export default app;
