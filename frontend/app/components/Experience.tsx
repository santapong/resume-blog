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
      <section className="py-20 bg-parchment-texture px-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-10 w-72 mx-auto mb-12" />
          {[1, 2].map(i => (
            <div key={i} className="skeleton h-48 mb-6 rounded" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-parchment-texture px-6" id="experience">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="section-heading mb-12">Chronicles of Service</h2>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative pl-12">
          {/* Vertical Timeline Line */}
          <div className="timeline-line" />

          <div className="space-y-10">
            {experiences.map((job, index) => (
              <ScrollReveal key={job.id} delay={index * 200}>
                <div className="relative">
                  {/* Timeline Node */}
                  <div className="timeline-node pulse-gold" style={{ top: '1.5rem' }} />

                  {/* Card */}
                  <div className="scroll-card p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-bold text-dark-wood">
                          {job.title}
                        </h3>
                        <p className="text-crimson font-semibold mt-1 flex items-center gap-2">
                          <span>🏛️</span> {job.company}
                        </p>
                      </div>
                      <span className="wax-tag whitespace-nowrap">
                        {job.period}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="ornamental-line mb-4" />

                    {/* Description */}
                    <p className="text-iron leading-relaxed mb-4">{job.description}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech: string) => (
                        <span key={tech} className="iron-tag">
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
          <div className="text-center text-iron/60 py-12">
            <p className="font-heading text-lg">No chronicles yet</p>
            <p className="text-sm mt-2">The story awaits its first chapter...</p>
          </div>
        )}
      </div>
    </section>
  );
}