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
    }, 40); // Slightly slower, more deliberate framing
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
      {/* Floating Mana Particles */}
      <FloatingParticles count={25} />

      {/* Magical auras */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-crimson-light/10 rounded-full torch-glow pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gold-light/10 rounded-full torch-glow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-crimson-light/5 rounded-full blur-3xl pointer-events-none" />

      {/* Elegant Corner Frames */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-gold-light/40 pointer-events-none rounded-tl-xl" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-gold-light/40 pointer-events-none rounded-tr-xl" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-gold-light/40 pointer-events-none rounded-bl-xl" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-gold-light/40 pointer-events-none rounded-br-xl" />

      <div className="max-w-4xl w-full px-6 z-10">
        <div className="space-y-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-parchment-light/80 backdrop-blur-sm border border-gold-light/60 px-5 py-2 rounded-full shadow-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson" />
            </span>
            <span className="font-heading text-xs tracking-[0.1em] text-iron">
              New Journeys Await
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h1 className="text-5xl md:text-7xl font-heading tracking-tight text-dark-wood">
              <span className="block">
                {config?.heroTitle?.split(' ').slice(0, -1).join(' ') || 'Software &'}
              </span>
              <span className="text-mana-gradient block mt-2 text-mana-glow">
                {config?.heroTitle?.split(' ').slice(-1)[0] || 'Engineer'}
              </span>
            </h1>

            {/* Typewriter Subtitle */}
            <p className="text-lg md:text-xl text-iron max-w-2xl mx-auto leading-relaxed min-h-[3.5rem] tracking-wide">
              {subtitleText || config?.heroSubtitle || 'Understanding the magic of logic, one line of code at a time...'}
              {showCursor && config?.heroSubtitle && <span className="typewriter-cursor" />}
            </p>
          </div>

          {/* Elegant Divider */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px w-24 bg-linear-to-r from-transparent to-gold-light" />
            <span className="text-gold-light text-xl animate-pulse">✧</span>
            <div className="h-px w-24 bg-linear-to-l from-transparent to-gold-light" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <button onClick={() => scrollTo('skills')} className="medieval-btn">
              ✨ View Grimoire
            </button>
            <button onClick={() => scrollTo('experience')} className="medieval-btn-outline">
              📖 Journey's Log
            </button>
          </div>

          {/* Tech breadcrumbs */}
          <div className="pt-10 flex flex-wrap justify-center items-center gap-8 text-iron-light animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="text-crimson-light/40 group-hover:text-crimson-light transition-colors duration-500">✦</span>
              <span className="text-xs font-heading tracking-[0.15em] uppercase text-iron group-hover:text-dark-wood transition-colors duration-500">
                A Mage's Journey Begins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-5 h-8 border border-iron-light rounded-full flex justify-center">
          <div className="w-1 h-2 bg-iron-light rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}