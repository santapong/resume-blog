"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { getConfig, type SiteConfig } from '@/app/lib/api';
import FloatingParticles from './FloatingParticles';

const roles = [
  'Software Engineer',
  'Automation Architect',
  'Agentic AI Explorer',
  'Full-Stack Developer',
  'DevOps Practitioner',
];

export default function Hero() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [currentRole, setCurrentRole] = useState(0);
  const [roleText, setRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    getConfig().then(setConfig).catch(() => {});
  }, []);

  // Typewriter for subtitle
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

  // Role cycling typewriter
  useEffect(() => {
    const role = roles[currentRole];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && roleText === role) {
      timeout = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && roleText === '') {
      setIsDeleting(false);
      setCurrentRole((prev) => (prev + 1) % roles.length);
    } else if (isDeleting) {
      timeout = setTimeout(() => setRoleText(role.slice(0, roleText.length - 1)), 30);
    } else {
      timeout = setTimeout(() => setRoleText(role.slice(0, roleText.length + 1)), 60);
    }

    return () => clearTimeout(timeout);
  }, [roleText, isDeleting, currentRole]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-parchment-texture overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <FloatingParticles count={30} />

      {/* Animated gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(108,180,238,0.3) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
          bottom: '10%',
          right: '10%',
          transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(232,184,75,0.4) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Decorative orbiting element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none">
        <div className="absolute w-2 h-2 bg-gold-light/30 rounded-full animate-spin-slow" style={{ animation: 'orbit 15s linear infinite' }} />
        <div className="absolute w-1.5 h-1.5 bg-crimson-light/30 rounded-full" style={{ animation: 'orbit 20s linear infinite reverse' }} />
      </div>

      {/* Corner frames */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-gold-light/20 pointer-events-none rounded-tl-2xl" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-gold-light/20 pointer-events-none rounded-tr-2xl" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-gold-light/20 pointer-events-none rounded-bl-2xl" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-gold-light/20 pointer-events-none rounded-br-2xl" />

      <div className="max-w-5xl w-full px-6 z-10">
        <div className="space-y-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 bg-parchment-light/60 backdrop-blur-xl border border-gold-light/20 px-5 py-2.5 rounded-full animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forest" />
            </span>
            <span className="font-heading text-[11px] tracking-[0.15em] text-iron uppercase">
              Available for New Adventures
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading tracking-tight text-dark-wood leading-[0.95]">
              <span className="block">
                {config?.heroTitle?.split(' ').slice(0, -1).join(' ') || 'Software &'}
              </span>
              <span className="text-mana-gradient block mt-3 text-mana-glow">
                {config?.heroTitle?.split(' ').slice(-1)[0] || 'Engineer'}
              </span>
            </h1>

            {/* Animated Role */}
            <div className="h-8 flex items-center justify-center">
              <span className="font-heading text-sm md:text-base tracking-[0.2em] uppercase text-gold-light/80">
                {'> '}{roleText}
                <span className="inline-block w-[2px] h-4 bg-gold-light ml-1 animate-pulse" />
              </span>
            </div>

            {/* Typewriter Subtitle */}
            <p className="text-base md:text-lg text-iron max-w-2xl mx-auto leading-relaxed min-h-[3rem] tracking-wide">
              {subtitleText || config?.heroSubtitle || 'Understanding the magic of logic, one line of code at a time...'}
              {showCursor && config?.heroSubtitle && <span className="typewriter-cursor" />}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-px w-32 bg-linear-to-r from-transparent to-gold-light/40" />
            <span className="text-gold-light/60 text-sm animate-pulse">&#10023;</span>
            <div className="h-px w-32 bg-linear-to-l from-transparent to-gold-light/40" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-5 pt-2 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <button onClick={() => scrollTo('skills')} className="medieval-btn text-sm">
              View Grimoire
            </button>
            <button onClick={() => scrollTo('experience')} className="medieval-btn-outline text-sm">
              Journey&apos;s Log
            </button>
          </div>

          {/* Tech stack mini-badges */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {['TypeScript', 'Python', 'React', 'Node.js', 'Docker'].map((tech, i) => (
              <span
                key={tech}
                className="px-3 py-1 text-[10px] font-heading tracking-widest uppercase text-iron-light/60 border border-iron-light/10 rounded-full hover:text-crimson-light hover:border-crimson-light/30 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${0.7 + i * 0.1}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
        <span className="text-iron-light text-[10px] font-heading tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-iron-light/50 rounded-full flex justify-center">
          <div className="w-1 h-2.5 bg-iron-light/50 rounded-full mt-1.5 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
