"use client";

import React, { useEffect, useState } from 'react';
import { getExperiences, type Experience as ExperienceType } from '@/app/lib/api';

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
        <div className="max-w-4xl mx-auto text-center text-iron">
          Unrolling the chronicles...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-parchment-texture px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-heading mb-12">Chronicles of Service</h2>

        <div className="space-y-8">
          {experiences.map((job, index) => (
            <div
              key={job.id}
              className="scroll-card p-6 md:p-8 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Wax Seal decoration */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-dark-wood">
                    {job.title}
                  </h3>
                  <p className="text-crimson font-semibold mt-1">{job.company}</p>
                </div>
                <span className="wax-tag whitespace-nowrap">
                  {job.period}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gold/50 to-transparent mb-4" />

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
          ))}

          {experiences.length === 0 && (
            <div className="text-center text-iron/60 py-12">
              <p className="font-[family-name:var(--font-heading)] text-lg">No chronicles yet</p>
              <p className="text-sm mt-2">The story awaits its first chapter...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}