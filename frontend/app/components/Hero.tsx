"use client";

import React from 'react';
import { Terminal, Cpu, ArrowRight, Mail } from 'lucide-react';

export default function Hero() {
  // Smooth scroll function for internal navigation
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-white px-6 overflow-hidden relative">
      {/* Subtle Background Pattern - Grid/Automation Aesthetic */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="max-w-4xl w-full z-10">
        <div className="space-y-8 text-center">
          
          {/* Online Status Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-blue-700 font-mono text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            System Online: Available for Agentic AI Projects
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
              Software & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Automation Engineer
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-auto max-w-2xl mx-auto leading-relaxed">
              Engineering high-performance <strong>Agentic AI</strong> systems and 
              autonomous <strong>Company as a Service</strong> tools. Built with the speed of Bun.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button 
              onClick={() => scrollTo('skills')}
              className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-blue-200/50"
            >
              View Tech Stack
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => scrollTo('experience')}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              Professional History
            </button>
          </div>

          {/* Quick Stats / Tech Breadcrumbs */}
          <div className="pt-12 flex justify-center items-center gap-8 text-slate-400">
            <div className="flex items-center gap-2 group cursor-default">
              <Terminal size={20} className="group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-mono tracking-widest uppercase">Bun / TS / Next.js</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Cpu size={20} className="group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-mono tracking-widest uppercase">Agentic AI Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}