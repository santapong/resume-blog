"use client";

import React, { useEffect, useState } from 'react';
import { getExperiences, type Experience as ExperienceType } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    getExperiences()
      .then(setExperiences)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-28 bg-parchment-texture px-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-10 w-72 mx-auto mb-16" />
          {[1, 2].map(i => (
            <div key={i} className="skeleton h-48 mb-8 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 bg-parchment-texture px-6 relative" id="experience">
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading mb-4">The Journey&apos;s Log</h2>
          <p className="text-center text-iron-light mb-16 font-heading tracking-widest text-xs opacity-70 uppercase">
            Chronicles of Growth & Discovery
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative pl-12 md:pl-16">
          {/* Vertical Mana Line */}
          <div className="timeline-line" />

          <div className="space-y-10">
            {experiences.map((job, index) => {
              const isExpanded = expandedId === job.id;
              return (
                <ScrollReveal key={job.id} delay={index * 200}>
                  <div className="relative group">
                    {/* Timeline Node */}
                    <div
                      className="timeline-node pulse-gold transition-all duration-500 group-hover:scale-150"
                      style={{ top: '1.75rem' }}
                    />

                    {/* Card */}
                    <div
                      className={`scroll-card p-6 md:p-8 cursor-pointer transition-all duration-500 ${isExpanded ? 'ring-1 ring-crimson-light/20' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : job.id)}
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-heading text-xl md:text-2xl text-dark-wood group-hover:text-crimson-light transition-colors">
                              {job.title}
                            </h3>
                          </div>
                          <p className="text-crimson-light/80 font-medium mt-1.5 flex items-center gap-2 text-sm">
                            <span className="w-6 h-6 rounded-lg bg-crimson-light/10 flex items-center justify-center text-xs">🏛️</span>
                            {job.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="wax-tag whitespace-nowrap">
                            {job.period}
                          </span>
                          <button
                            className={`w-7 h-7 rounded-full border border-iron-light/20 flex items-center justify-center text-iron-light/50 hover:text-dark-wood hover:border-gold-light/40 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 5L6 8L9 5" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Description - always show first 2 lines, expand for full */}
                      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96' : 'max-h-12'}`}>
                        <div className="w-full h-px bg-linear-to-r from-iron-light/10 to-transparent mb-4" />
                        <p className="text-iron text-[15px] leading-relaxed mb-6">{job.description}</p>
                      </div>

                      {/* Technologies */}
                      <div className={`flex flex-wrap gap-2 transition-all duration-500 ${isExpanded ? 'mt-2' : 'mt-3'}`}>
                        {job.technologies.map((tech: string, ti: number) => (
                          <span
                            key={tech}
                            className="iron-tag text-[11px]"
                            style={{
                              animationDelay: isExpanded ? `${ti * 50}ms` : '0ms',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {experiences.length === 0 && (
          <div className="text-center text-iron/60 py-16">
            <p className="font-heading text-xl">The journey has just begun.</p>
            <p className="text-sm mt-3 font-light">Pages of this log currently remain unwritten...</p>
          </div>
        )}
      </div>

      {/* Background decorations */}
      <div className="absolute top-[20%] right-0 w-64 h-64 bg-gold-light/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-72 h-72 bg-violet/3 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}
