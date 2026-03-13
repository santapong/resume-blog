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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-parchment-texture">
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-crimson-light/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet/5 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <h1 className="section-heading mb-4">The Archmage&apos;s Decree</h1>
            <p className="text-center text-iron max-w-lg mx-auto mb-10 text-sm">
              The official decree of skills, qualifications, and magical proficiencies.
            </p>
          </ScrollReveal>

          {loading ? (
            <div className="space-y-4">
              <div className="skeleton h-12 w-48 mx-auto rounded-xl" />
              <div className="skeleton h-[600px] rounded-2xl" />
            </div>
          ) : resume ? (
            <ScrollReveal delay={200}>
              <div className="scroll-card overflow-hidden">
                {/* Header */}
                <div className="bg-parchment-light/30 border-b border-gold-light/10 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold-light/10 flex items-center justify-center">
                      <span className="text-base">📄</span>
                    </div>
                    <div>
                      <h2 className="font-heading text-dark-wood font-bold text-sm tracking-wider">
                        {resume.filename}
                      </h2>
                      <p className="text-iron-light/50 text-xs">
                        Last updated: {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${API_URL}/resume/download`}
                    className="medieval-btn text-xs !py-2 !px-5 flex items-center gap-2"
                    download
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download
                  </a>
                </div>

                {/* PDF Viewer */}
                <div className="bg-aged-paper/30">
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
              <div className="text-center py-24 glass-card max-w-md mx-auto">
                <div className="text-5xl mb-5 opacity-40">📜</div>
                <p className="font-heading text-xl text-dark-wood mb-2">
                  No Decree Found
                </p>
                <p className="text-iron text-sm max-w-sm mx-auto">
                  The grand scroll has not yet been transcribed. Check back soon.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </main>
  );
}
