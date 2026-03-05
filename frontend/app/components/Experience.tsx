"use client";

import React, { useEffect, useState } from 'react';
import { getExperiences, type Experience as ExperienceType } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExperiences()
      .then(setExperiences)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-parchment-texture px-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-10 w-72 mx-auto mb-16" />
          {[1, 2].map(i => (
            <div key={i} className="skeleton h-48 mb-8 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-parchment-texture px-6 relative" id="experience">
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading mb-16">The Journey&apos;s Log</h2>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative pl-12 md:pl-16">
          {/* Vertical Mana Line */}
          <div className="timeline-line" />

          <div className="space-y-12">
            {experiences.map((job, index) => (
              <ScrollReveal key={job.id} delay={index * 200}>
                <div className="relative group">
                  {/* Timeline Node - Glowing Mana Orb */}
                  <div className="timeline-node pulse-gold transition-transform duration-500 group-hover:scale-125" style={{ top: '1.5rem' }} />

                  {/* Log Card */}
                  <div className="scroll-card p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <h3 className="font-heading text-2xl text-dark-wood">
                          {job.title}
                        </h3>
                        <p className="text-crimson font-medium mt-1.5 flex items-center gap-2 text-sm">
                          <span className="text-lg">🏛️</span> {job.company}
                        </p>
                      </div>
                      <span className="wax-tag whitespace-nowrap self-start md:self-auto shadow-sm">
                        {job.period}
                      </span>
                    </div>

                    {/* Subtle Divider */}
                    <div className="w-full h-px bg-linear-to-r from-iron-light/20 to-transparent mb-5" />

                    {/* Description */}
                    <p className="text-iron text-[15px] leading-relaxed mb-6">{job.description}</p>

                    {/* Technologies/Spells used */}
                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech: string) => (
                        <span key={tech} className="iron-tag shadow-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {experiences.length === 0 && (
          <div className="text-center text-iron/60 py-16">
            <p className="font-heading text-xl">The journey has just begun.</p>
            <p className="text-sm mt-3 font-light">Pages of this log currently remain unwritten...</p>
          </div>
        )}
      </div>

      {/* Decorative backdrop elements */}
      <div className="absolute top-[20%] right-0 w-64 h-64 bg-gold-light/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-72 h-72 bg-crimson-light/5 rounded-full blur-[80px] pointer-events-none" />
    </section>
  );
}