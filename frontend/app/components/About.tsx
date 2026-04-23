"use client";

import React, { useEffect, useState } from 'react';
import { getConfig, type SiteConfig } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function About() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    getConfig().then(setConfig).catch(() => {});
  }, []);

  const highlights = [
    { icon: '🎯', label: 'Problem Solver', desc: 'Turning complex challenges into elegant solutions' },
    { icon: '🚀', label: 'Fast Learner', desc: 'Adapting quickly to new technologies and paradigms' },
    { icon: '🤝', label: 'Team Player', desc: 'Collaborating effectively across diverse teams' },
    { icon: '💡', label: 'Innovator', desc: 'Pushing boundaries with creative approaches' },
  ];

  return (
    <section className="py-28 bg-parchment-texture px-6 relative overflow-hidden" id="about">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-nebula-purple/20 to-transparent" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-nebula-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] bg-nebula-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="section-heading mb-4">About the Explorer</h2>
          <p className="text-center text-stardust-light mb-16 font-heading tracking-widest text-xs opacity-70 uppercase">
            A Glimpse Into the Journey
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* About text */}
          <ScrollReveal className="lg:col-span-3" delay={100}>
            <div className="glass-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-nebula-purple/20 to-nebula-blue/20 flex items-center justify-center border border-nebula-purple/10">
                  <span className="text-2xl">🧑‍🚀</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg text-starlight">About Me</h3>
                  <p className="text-stardust-light text-xs font-heading tracking-wider uppercase">Background & Philosophy</p>
                </div>
              </div>

              <div className="space-y-4 text-stardust leading-relaxed text-[15px]">
                {config?.aboutText ? (
                  config.aboutText.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <>
                    <p>
                      A passionate software engineer dedicated to crafting elegant solutions and exploring the
                      frontiers of technology. With expertise spanning full-stack development, automation, and
                      AI integration, I bring a blend of technical depth and creative thinking to every project.
                    </p>
                    <p>
                      My journey through the digital cosmos has taught me that the best solutions are those
                      that are simple, maintainable, and built with care. I believe in writing code that
                      not only works but inspires.
                    </p>
                  </>
                )}
              </div>

              {/* Quick stats inline */}
              <div className="mt-8 pt-6 border-t border-nebula-purple/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-cosmic-gradient">3+</div>
                  <div className="text-stardust-light text-[10px] font-heading tracking-wider uppercase mt-1">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-cosmic-gradient">10+</div>
                  <div className="text-stardust-light text-[10px] font-heading tracking-wider uppercase mt-1">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-2xl font-bold text-cosmic-gradient">15+</div>
                  <div className="text-stardust-light text-[10px] font-heading tracking-wider uppercase mt-1">Technologies</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Highlight cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {highlights.map((item, i) => (
              <ScrollReveal key={item.label} delay={200 + i * 100}>
                <div className="group glass-card p-5 flex items-start gap-4 hover:border-nebula-purple/20">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-nebula-purple/10 to-nebula-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-nebula-purple/10">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm text-starlight font-bold tracking-wide group-hover:text-nebula-purple-light transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-stardust-light text-xs mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
