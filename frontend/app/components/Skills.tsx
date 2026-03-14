"use client";

import React, { useEffect, useState } from 'react';
import { getSkills, type Skill } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

const categoryIcons: Record<string, string> = {
  'Languages': '📜',
  'Backend/Runtime': '🔮',
  'DevOps & Automation': '⚙️',
  'Security/Linux': '🛡️',
  'Frontend': '🎨',
  'Database': '🗄️',
  'Cloud': '☁️',
  'AI/ML': '🤖',
};

const categoryColors: Record<string, { from: string; to: string; glow: string }> = {
  'Languages': { from: 'from-amber-400/20', to: 'to-orange-400/20', glow: 'rgba(251, 191, 36, 0.15)' },
  'Backend/Runtime': { from: 'from-purple-400/20', to: 'to-violet-400/20', glow: 'rgba(167, 139, 250, 0.15)' },
  'DevOps & Automation': { from: 'from-sky-400/20', to: 'to-blue-400/20', glow: 'rgba(56, 189, 248, 0.15)' },
  'Security/Linux': { from: 'from-emerald-400/20', to: 'to-green-400/20', glow: 'rgba(52, 211, 153, 0.15)' },
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    getSkills()
      .then(setSkills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-28 bg-dark-texture px-6">
        <div className="max-w-5xl mx-auto">
          <div className="skeleton-dark h-10 w-64 mx-auto mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-dark h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const totalSkills = skills.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <section className="py-28 bg-dark-texture px-6 relative overflow-hidden" id="skills">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-light/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-light/20 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-crimson-light/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-violet/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading-dark mb-4">Grimoire of Arcane Logic</h2>
          <p className="text-center text-iron-light mb-6 font-heading tracking-widest text-xs opacity-70 uppercase">
            Spells & Runes Mastered Across Eras
          </p>
          {/* Total skill counter */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-2 bg-parchment-light/40 backdrop-blur-sm border border-gold-light/10 px-4 py-2 rounded-full">
              <span className="text-gold-light font-heading text-sm font-bold">{totalSkills}</span>
              <span className="text-iron-light text-xs font-heading tracking-wider uppercase">Technologies Mastered</span>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((group, i) => {
            const colors = categoryColors[group.category] || { from: 'from-sky-400/20', to: 'to-blue-400/20', glow: 'rgba(108, 180, 238, 0.15)' };
            const isActive = activeCategory === group.id;

            return (
              <ScrollReveal key={group.id} delay={i * 150} variant={i % 2 === 0 ? 'left' : 'up'}>
                <div
                  className={`glass-card p-7 h-full cursor-pointer transition-all duration-500 ${isActive ? 'ring-1 ring-gold-light/20' : ''}`}
                  onClick={() => setActiveCategory(isActive ? null : group.id)}
                  style={{
                    boxShadow: isActive ? `0 0 40px ${colors.glow}` : undefined,
                  }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${colors.from} ${colors.to} flex items-center justify-center border border-white/5`}>
                      <span className="text-2xl filter drop-shadow-md">
                        {categoryIcons[group.category] || '✨'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-dark-wood tracking-wide">
                        {group.category}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-parchment-light/30 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-gold to-crimson-light animate-progress"
                            style={{ width: `${Math.min(100, group.items.length * 12)}%` }}
                          />
                        </div>
                        <span className="text-gold-light/60 font-heading text-xs">
                          {group.items.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skill Items */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill: string, si: number) => (
                      <span
                        key={skill}
                        className={`iron-tag cursor-default text-xs font-normal transition-all duration-300 ${hoveredSkill === skill ? 'scale-105' : ''}`}
                        style={{
                          animationDelay: `${si * 50}ms`,
                        }}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Expand indicator */}
                  <div className={`mt-4 text-center transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-px w-full bg-linear-to-r from-transparent via-gold-light/20 to-transparent" />
                    <p className="text-iron-light/40 text-[10px] font-heading tracking-wider uppercase mt-3">
                      {group.items.length} proficiencies in this domain
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
