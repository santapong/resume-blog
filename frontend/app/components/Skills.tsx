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
    'Languages': '📜',
    'Backend/Runtime': '🔮',
    'DevOps & Automation': '⚙️',
    'Security/Linux': '🛡️',
  };

  if (loading) {
    return (
      <section className="py-24 bg-dark-texture px-6">
        <div className="max-w-5xl mx-auto">
          <div className="skeleton-dark h-10 w-64 mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-dark h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-dark-texture px-6 relative overflow-hidden" id="skills">
      {/* Top/Bottom elegant dividers */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-gold-light/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-gold-light/30 to-transparent" />

      {/* Deep magical background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson-light/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading-dark mb-4">Grimoire of Arcane Logic</h2>
          <p className="text-center text-iron-light mb-16 font-heading tracking-widest text-sm opacity-80 uppercase">
            ✧ Spells & Runes Mastered Across Eras ✧
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {skills.map((group, i) => (
            <ScrollReveal key={group.id} delay={i * 150} variant={i % 2 === 0 ? 'left' : 'up'}>
              <div className="glass-card p-8 h-full">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl filter drop-shadow-md">
                    {categoryIcons[group.category] || '✨'}
                  </span>
                  <h3 className="font-heading text-xl text-parchment-light tracking-wide">
                    {group.category}
                  </h3>
                  <span className="ml-auto text-gold-light/60 font-heading text-xs uppercase tracking-wider">
                    {group.items.length} known
                  </span>
                </div>

                {/* Magical Divider */}
                <div className="ornamental-line mb-6 opacity-30" />

                {/* Skill Items */}
                <div className="flex flex-wrap gap-2.5">
                  {group.items.map((skill: string) => (
                    <span
                      key={skill}
                      className="iron-tag cursor-default text-xs font-normal"
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