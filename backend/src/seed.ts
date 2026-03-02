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
                company: 'Your Current Project',
                period: '2024 - Present',
                description: 'Developing "Company as a Service" agentic tools using Bun and n8n. Building AI-powered automation pipelines and microservices architecture.',
                technologies: JSON.stringify(['Bun', 'Docker', 'TypeScript', 'n8n', 'Next.js']),
                order: 1,
            },
        ],
    });

    // Seed skills
    await prisma.skill.createMany({
        data: [
            { category: 'Languages', items: JSON.stringify(['TypeScript', 'Python', 'Bash', 'SQL']), order: 1 },
            { category: 'Backend/Runtime', items: JSON.stringify(['Bun', 'Node.js', 'Next.js', 'FastAPI']), order: 2 },
            { category: 'DevOps & Automation', items: JSON.stringify(['Docker', 'n8n', 'Jenkins', 'GitHub Actions']), order: 3 },
            { category: 'Security/Linux', items: JSON.stringify(['Kali Linux', 'Nmap', 'Metasploit', 'SSH']), order: 4 },
        ],
    });

    // Seed site config
    await prisma.siteConfig.create({
        data: {
            heroTitle: 'Software & Automation Engineer',
            heroSubtitle: 'Forging digital solutions in the fires of innovation',
            aboutText: 'A seasoned engineer specializing in Agentic AI, automation, and modern web technologies.',
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
