import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
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
        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch configuration.' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const { heroTitle, heroSubtitle, aboutText, sectionLayout } = await request.json();
        const data: Record<string, unknown> = {};
        if (heroTitle !== undefined) data.heroTitle = heroTitle;
        if (heroSubtitle !== undefined) data.heroSubtitle = heroSubtitle;
        if (aboutText !== undefined) data.aboutText = aboutText;
        if (sectionLayout !== undefined) {
            data.sectionLayout = typeof sectionLayout === 'string' ? sectionLayout : JSON.stringify(sectionLayout);
        }

        const config = await prisma.siteConfig.upsert({
            where: { id: 1 },
            update: data,
            create: {
                heroTitle: heroTitle || 'Software & Automation Engineer',
                heroSubtitle: heroSubtitle || '',
                aboutText: aboutText || '',
            },
        });
        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: 'Failed to update configuration.' }, { status: 500 });
    }
}
