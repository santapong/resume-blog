"use client";

import React, { useEffect, useState } from 'react';
import { getConfig, type SiteConfig } from '@/app/lib/api';
import FloatingParticles from './FloatingParticles';

export default function Hero() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    getConfig().then(setConfig).catch(() => { });
  }, []);

  // Typewriter effect for subtitle
  useEffect(() => {
    if (!config?.heroSubtitle) return;
    const text = config.heroSubtitle;
    let i = 0;
    setSubtitleText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setSubtitleText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [config?.heroSubtitle]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-parchment-texture overflow-hidden">
      {/* Floating Ember Particles */}
      <FloatingParticles count={15} />

      {/* Decorative torch glows */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-gold/20 rounded-full torch-glow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-crimson/15 rounded-full torch-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ornamental Corner Frames */}
      <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-gold/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-gold/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-gold/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-gold/30 pointer-events-none" />

      <div className="max-w-4xl w-full px-6 z-10">
        <div className="space-y-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-dark-wood/10 border border-gold/40 px-5 py-2 rounded-full animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest" />
            </span>
            <span className="font-heading text-xs tracking-[0.15em] uppercase text-dark-wood">
              Available for Quests
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight">
              <span className="text-dark-wood block">
                {config?.heroTitle?.split(' ').slice(0, -1).join(' ') || 'Software &'}
              </span>
              <span className="text-gold-gradient block mt-2 text-gold-glow">
                {config?.heroTitle?.split(' ').slice(-1)[0] || 'Engineer'}
              </span>
            </h1>

            {/* Typewriter Subtitle */}
            <p className="text-lg md:text-xl text-iron max-w-2xl mx-auto leading-relaxed min-h-[3.5rem]">
              {subtitleText || config?.heroSubtitle || 'Forging digital solutions in the fires of innovation...'}
              {showCursor && config?.heroSubtitle && <span className="typewriter-cursor" />}
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px w-24 bg-linear-to-r from-transparent to-gold" />
            <span className="text-gold text-2xl animate-pulse">⚔️</span>
            <div className="h-px w-24 bg-linear-to-l from-transparent to-gold" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <button onClick={() => scrollTo('skills')} className="medieval-btn">
              🛡️ View Arsenal
            </button>
            <button onClick={() => scrollTo('experience')} className="medieval-btn-outline">
              📜 Chronicles
            </button>
          </div>

          {/* Tech breadcrumbs */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-iron-light animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {['Bun / TypeScript', 'Agentic AI', 'Docker / DevOps'].map((tech) => (
              <div key={tech} className="flex items-center gap-2 group cursor-default">
                <span className="text-gold/60 group-hover:text-gold transition-colors duration-300">✦</span>
                <span className="text-xs font-heading tracking-[0.15em] uppercase group-hover:text-dark-wood transition-colors duration-300">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}