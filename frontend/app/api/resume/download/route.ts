import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const resume = await prisma.resume.findFirst({
            where: { isActive: true },
            orderBy: { uploadedAt: 'desc' },
        });
        if (!resume) return NextResponse.json({ error: 'No active resume found.' }, { status: 404 });

        // Stream the PDF from Vercel Blob through the API so the browser
        // shows a clean Resume.pdf filename rather than the hashed Blob URL.
        const upstream = await fetch(resume.url);
        if (!upstream.ok) {
            return NextResponse.json({ error: 'Failed to fetch resume.' }, { status: 502 });
        }
        return new NextResponse(upstream.body, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Resume.pdf"',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Failed to download resume.' }, { status: 500 });
    }
}
