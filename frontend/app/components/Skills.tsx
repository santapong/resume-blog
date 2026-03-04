"use client";

import React, { useEffect, useState } from 'react';
import { getSkills, type Skill } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const categoryIcons: Record<string, string> = {
    'Languages': '📖',
    'Backend/Runtime': '⚒️',
    'DevOps & Automation': '🏗️',
    'Security/Linux': '🛡️',
  };

  if (loading) {
    return (
      <section className="py-20 bg-dark-texture px-6">
        <div className="max-w-5xl mx-auto">
          <div className="skeleton-dark h-10 w-64 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-dark h-40 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-dark-texture px-6 relative overflow-hidden" id="skills">
      {/* Top/Bottom decorative lines */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-gold to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading-dark mb-2">Ye Olde Arsenal</h2>
          <p className="text-center text-gold/60 mb-12 font-heading text-sm tracking-[0.15em] uppercase">
            ✦ Tools of the Trade ✦
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((group, i) => (
            <ScrollReveal key={group.id} delay={i * 120} variant={i % 2 === 0 ? 'left' : 'up'}>
              <div className="scroll-card p-6 h-full">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">
                    {categoryIcons[group.category] || '⚔️'}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-dark-wood tracking-wider uppercase">
                    {group.category}
                  </h3>
                  <span className="ml-auto text-gold/50 font-heading text-xs">
                    {group.items.length} skills
                  </span>
                </div>

                {/* Divider */}
                <div className="ornamental-line mb-4" />

                {/* Skill Items */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill: string) => (
                    <span
                      key={skill}
                      className="iron-tag cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}