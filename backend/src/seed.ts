import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🏰 Seeding the medieval database...');

    // Generate admin password hash and display it
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log(`\n⚔️  Admin credentials:`);
    console.log(`   Username: admin`);
    console.log(`   Password: ${password}`);
    console.log(`   Hash: ${hash}`);
    console.log(`\n   Set ADMIN_PASSWORD_HASH="${hash}" in your .env file\n`);

    // Seed experiences
    await prisma.experience.createMany({
        data: [
            {
                title: 'Software & Automation Engineer',
                company: 'Independent / Freelance',
                period: '2024 - Present',
                description: 'Building "Company as a Service" agentic tooling and AI-powered automation pipelines. Designing containerised microservices, orchestrating n8n workflows, and shipping full-stack products end-to-end.',
                technologies: JSON.stringify(['Bun', 'TypeScript', 'Next.js', 'Docker', 'n8n', 'FastAPI']),
                order: 1,
            },
            {
                title: 'Embedded Systems & Automation Builder',
                company: 'Personal & Academic Projects',
                period: '2023 - 2024',
                description: 'Built autonomous flight control for a Raspberry Pi Pico W drone in Rust (PID/LQG) and a Raspberry Pi RFID/barcode access system with a Flask dashboard. Fine-tuned open LLMs (Qwen, Llama, Mistral) with LoRA/QLoRA for task-specific assistants.',
                technologies: JSON.stringify(['Rust', 'Python', 'Raspberry Pi', 'Flask', 'LoRA/QLoRA']),
                order: 2,
            },
        ],
    });

    // Seed skills
    await prisma.skill.createMany({
        data: [
            { category: 'Languages', items: JSON.stringify(['TypeScript', 'Python', 'Rust', 'Bash', 'SQL']), order: 1 },
            { category: 'Backend / Runtime', items: JSON.stringify(['Bun', 'Node.js', 'Next.js', 'FastAPI', 'Flask']), order: 2 },
            { category: 'DevOps & Automation', items: JSON.stringify(['Docker', 'n8n', 'Jenkins', 'GitHub Actions']), order: 3 },
            { category: 'Embedded & Hardware', items: JSON.stringify(['Raspberry Pi', 'Pico W', 'RFID', 'PID / LQG Control']), order: 4 },
            { category: 'AI / ML', items: JSON.stringify(['LoRA / QLoRA Fine-tuning', 'Qwen', 'Llama', 'Mistral', 'LLM Pipelines']), order: 5 },
            { category: 'Security / Linux', items: JSON.stringify(['Kali Linux', 'Nmap', 'Metasploit', 'SSH']), order: 6 },
        ],
    });

    // Seed projects
    await prisma.project.createMany({
        data: [
            {
                title: 'Muninn',
                description: 'Autonomous drone flight controller running on a Raspberry Pi Pico W. Written in Rust with PID and LQG control loops for stable attitude and position hold.',
                repoUrl: 'https://github.com/santapong/Muninn',
                technologies: JSON.stringify(['Rust', 'Raspberry Pi Pico W', 'PID', 'LQG']),
                featured: true,
                order: 1,
            },
            {
                title: 'RFID Project 2024',
                description: 'Raspberry Pi RFID and barcode reader system with a Flask-based web dashboard for live access logs and device management.',
                repoUrl: 'https://github.com/santapong/RFID_Project_2024',
                technologies: JSON.stringify(['Python', 'Flask', 'Raspberry Pi', 'RFID']),
                featured: true,
                order: 2,
            },
            {
                title: 'Forge',
                description: 'AI-powered manufacturing platform for custom jewelry — sketch-to-CAD conversion with downstream CNC planning and job orchestration.',
                technologies: JSON.stringify(['Python', 'LLMs', 'CAD', 'CNC']),
                featured: true,
                order: 3,
            },
            {
                title: 'Resume Blog',
                description: 'This site. A Next.js + Express + Prisma portfolio with a drag-and-drop admin dashboard and a cosmic starfield theme.',
                repoUrl: 'https://github.com/santapong/resume-blog',
                technologies: JSON.stringify(['Next.js', 'Express', 'Prisma', 'Tailwind CSS', 'Bun']),
                featured: false,
                order: 4,
            },
            {
                title: 'Obsidian',
                description: 'Companion tooling repo for personal knowledge capture and agent workflows.',
                repoUrl: 'https://github.com/santapong/obsidian',
                technologies: JSON.stringify(['TypeScript', 'Automation']),
                featured: false,
                order: 5,
            },
        ],
    });

    // Seed blog posts (one published, one draft) so /blog renders out of the box
    await prisma.blogPost.createMany({
        data: [
            {
                title: 'Hello, Cosmos',
                slug: 'hello-cosmos',
                excerpt: 'A quick note on why this site exists and what I plan to write here.',
                content: '# Hello, Cosmos\n\nThis is the first entry in the log. Expect short notes on **automation**, **embedded systems**, and the occasional **AI tinkering** session.\n\nIf any of that sounds interesting, stick around.',
                tags: JSON.stringify(['meta', 'intro']),
                published: true,
            },
            {
                title: 'Notes on a Pico W drone',
                slug: 'notes-on-a-pico-w-drone',
                excerpt: 'Draft — early observations from tuning a PID loop on the Muninn flight controller.',
                content: '# Notes on a Pico W drone\n\n*(draft)* \n\nTuning a PID loop on a 150 MHz microcontroller is a different game than on a simulator. More soon.',
                tags: JSON.stringify(['rust', 'embedded', 'control-theory']),
                published: false,
            },
        ],
    });

    // Seed site config
    await prisma.siteConfig.create({
        data: {
            heroTitle: 'Software & Automation Engineer',
            heroSubtitle: 'Automation, embedded systems, and AI — shipped end-to-end.',
            aboutText: 'Full-stack engineer working across agentic automation, embedded hardware, and applied AI. I like building systems that quietly do the boring work so humans can focus on the interesting parts.',
        },
    });

    console.log('✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
