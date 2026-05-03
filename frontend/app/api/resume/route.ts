import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
    try {
        const resume = await prisma.resume.findFirst({
            where: { isActive: true },
            orderBy: { uploadedAt: 'desc' },
        });
        if (!resume) return NextResponse.json({ error: 'No active resume found.' }, { status: 404 });
        return NextResponse.json(resume);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch resume.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const unauthorized = requireAuth(request);
    if (unauthorized) return unauthorized;
    try {
        const formData = await request.formData();
        const file = formData.get('resume');
        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
        }

        const filename = `resume_${Date.now()}.pdf`;
        const blob = await put(`resumes/${filename}`, file, {
            access: 'public',
            contentType: 'application/pdf',
        });

        await prisma.resume.updateMany({ where: { isActive: true }, data: { isActive: false } });
        const resume = await prisma.resume.create({
            data: { filename, url: blob.url, isActive: true },
        });

        return NextResponse.json(resume, { status: 201 });
    } catch (err) {
        console.error('Resume upload failed:', err);
        return NextResponse.json({ error: 'Failed to upload resume.' }, { status: 500 });
    }
}
