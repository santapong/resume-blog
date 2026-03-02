"use client";

import React, { useEffect, useState } from 'react';
import { getResume, type ResumeInfo } from '@/app/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001/api';
const BACKEND_URL = API_URL.replace('/api', '');

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
            {/* Header */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="section-heading mb-4">The Royal Decree</h1>
                    <p className="text-iron max-w-xl mx-auto">
                        The official scroll of qualifications and accomplishments — a testament to years of dedicated service in the realm of technology.
                    </p>
                </div>
            </section>

            {/* Resume Section */}
            <section className="pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center text-iron/60 py-12">
                            <p className="font-[family-name:var(--font-heading)]">Unrolling the royal decree...</p>
                        </div>
                    ) : resume ? (
                        <div className="space-y-6">
                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href={`${BACKEND_URL}${resume.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="medieval-btn inline-flex items-center gap-2"
                                >
                                    📜 View Full Decree
                                </a>
                                <a
                                    href={`${BACKEND_URL}/api/resume/download`}
                                    className="medieval-btn-outline inline-flex items-center gap-2"
                                >
                                    ⬇️ Download Scroll
                                </a>
                            </div>

                            {/* PDF Viewer */}
                            <div className="medieval-border rounded-lg overflow-hidden">
                                <div className="bg-dark-wood/90 px-4 py-2 flex items-center gap-2 border-b border-gold/30">
                                    <span className="text-gold text-sm">📜</span>
                                    <span className="text-parchment/70 text-sm font-[family-name:var(--font-heading)] tracking-wider">
                                        {resume.filename}
                                    </span>
                                </div>
                                <iframe
                                    src={`${BACKEND_URL}${resume.url}`}
                                    className="w-full h-[80vh] bg-white"
                                    title="Resume PDF"
                                />
                            </div>

                            {/* Upload date */}
                            <p className="text-center text-iron-light text-sm">
                                Last inscribed: {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📜</div>
                            <p className="font-[family-name:var(--font-heading)] text-xl text-dark-wood mb-2">
                                No Royal Decree Found
                            </p>
                            <p className="text-iron">
                                The scroll has not yet been inscribed. Visit the admin chamber to upload your decree.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
