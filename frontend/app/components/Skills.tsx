"use client";

import React, { useEffect, useState } from 'react';
import { getSkills, type Skill } from '@/app/lib/api';

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
      <section className="py-20 bg-dark-wood px-6">
        <div className="max-w-5xl mx-auto text-center text-parchment/60">
          Loading the arsenal...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-dark-wood px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center text-parchment mb-2">
          Ye Olde Arsenal
        </h2>
        <p className="text-center text-gold/70 mb-12 font-[family-name:var(--font-heading)] text-sm tracking-[0.15em] uppercase">
          ✦ Tools of the Trade ✦
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((group) => (
            <div
              key={group.id}
              className="scroll-card p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {categoryIcons[group.category] || '⚔️'}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-dark-wood tracking-wider uppercase">
                  {group.category}
                </h3>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-gold to-transparent mb-4" />

              {/* Skill Items */}
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill: string) => (
                  <span
                    key={skill}
                    className="iron-tag hover:bg-crimson hover:border-crimson transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}