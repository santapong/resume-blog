"use client";

import React, { useEffect, useState } from 'react';
import { getConfig, type SiteConfig } from '@/app/lib/api';

export default function Hero() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    getConfig().then(setConfig).catch(() => { });
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-parchment-texture overflow-hidden">
      {/* Decorative torch glows */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gold/20 rounded-full torch-glow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-crimson/15 rounded-full torch-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 text-gold/30 text-4xl pointer-events-none">╔</div>
      <div className="absolute top-6 right-6 text-gold/30 text-4xl pointer-events-none">╗</div>
      <div className="absolute bottom-6 left-6 text-gold/30 text-4xl pointer-events-none">╚</div>
      <div className="absolute bottom-6 right-6 text-gold/30 text-4xl pointer-events-none">╝</div>

      <div className="max-w-4xl w-full px-6 z-10">
        <div className="space-y-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-dark-wood/10 border border-gold/40 px-5 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
            </span>
            <span className="text-dark-wood font-[family-name:var(--font-heading)] text-xs tracking-[0.15em] uppercase">
              Available for Quests
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] font-bold tracking-tight">
              <span className="text-dark-wood block">
                {config?.heroTitle?.split(' ').slice(0, -1).join(' ') || 'Software &'}
              </span>
              <span className="text-gold-gradient block mt-2">
                {config?.heroTitle?.split(' ').slice(-1)[0] || 'Engineer'}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-iron max-w-2xl mx-auto leading-relaxed">
              {config?.heroSubtitle || 'Forging digital solutions in the fires of innovation — crafting Agentic AI systems and Company as a Service tools.'}
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-xl">⚔️</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => scrollTo('skills')}
              className="medieval-btn"
            >
              🛡️ View Arsenal
            </button>
            <button
              onClick={() => scrollTo('experience')}
              className="medieval-btn-outline"
            >
              📜 Chronicles
            </button>
          </div>

          {/* Tech breadcrumbs */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-iron-light">
            {['Bun / TypeScript', 'Agentic AI', 'Docker / DevOps'].map((tech) => (
              <div key={tech} className="flex items-center gap-2 group cursor-default">
                <span className="text-gold/60 group-hover:text-gold transition-colors">✦</span>
                <span className="text-xs font-[family-name:var(--font-heading)] tracking-[0.15em] uppercase">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}