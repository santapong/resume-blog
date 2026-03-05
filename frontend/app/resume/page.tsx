"use client";

import React, { useEffect, useState } from 'react';
import { getResume, type ResumeInfo } from '@/app/lib/api';
import ScrollReveal from '@/app/components/ScrollReveal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001/api';

export default function ResumePage() {
    const [resume, setResume] = useState<ResumeInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResume()
            .then(setResume)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-parchment-texture">
            <section className="pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Background magical glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mana-glow opacity-20 blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <ScrollReveal>
                        <h1 className="section-heading mb-4">The Archmage's Decree</h1>
                        <p className="text-center text-iron max-w-lg mx-auto mb-10 text-[15px]">
                            Within this scroll lies the official decree of skills, qualifications, and magical proficiencies tested by time.
                        </p>
                    </ScrollReveal>

                    {loading ? (
                        <div className="space-y-4">
                            <div className="skeleton h-12 w-48 mx-auto rounded" />
                            <div className="skeleton h-[600px] rounded" />
                        </div>
                    ) : resume ? (
                        <ScrollReveal delay={200}>
                            <div className="scroll-card overflow-hidden">
                                {/* Header */}
                                <div className="bg-dark-wood-light/5 border-b border-gold-light/40 px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h2 className="font-heading text-dark-wood font-bold text-sm tracking-widest uppercase">
                                            📄 {resume.filename}
                                        </h2>
                                        <p className="text-iron/70 text-xs mt-1">
                                            Sealed On: {new Date(resume.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <a
                                        href={`${API_URL}/resume/download`}
                                        className="medieval-btn text-xs py-2! px-5!"
                                        download
                                    >
                                        📥 Acquire Scroll
                                    </a>
                                </div>

                                {/* PDF Viewer */}
                                <div className="bg-aged-paper/50">
                                    <iframe
                                        src={`${API_URL}/resume/download`}
                                        className="w-full h-[750px]"
                                        title="Resume PDF"
                                    />
                                </div>
                            </div>
                        </ScrollReveal>
                    ) : (
                        <ScrollReveal delay={200}>
                            <div className="text-center py-20 scroll-card glass-card">
                                <div className="text-6xl mb-4 opacity-70">📜</div>
                                <p className="font-heading text-xl text-dark-wood mb-2">
                                    No Decree Found
                                </p>
                                <p className="text-iron max-w-sm mx-auto">
                                    The grand scroll has not yet been transcribed. The elves are likely still writing it.
                                </p>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </section>
        </main>
    );
}
