"use client";

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  icon: string;
  color: string;
}

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function CircularProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const ref = useRef<SVGCircleElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg width="96" height="96" className="transform -rotate-90">
      <circle
        cx="48" cy="48" r={radius}
        fill="none"
        stroke="rgba(200,214,229,0.08)"
        strokeWidth="4"
      />
      <circle
        ref={ref}
        cx="48" cy="48" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animated ? circumference - progress : circumference}
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

const defaultStats: Stat[] = [
  { value: 3, label: 'Years of Service', suffix: '+', icon: '⏳', color: '#e8b84b' },
  { value: 10, label: 'Quests Completed', suffix: '+', icon: '⚔️', color: '#6cb4ee' },
  { value: 15, label: 'Weapons Mastered', suffix: '+', icon: '🛡️', color: '#a78bfa' },
  { value: 99, label: 'Dedication', suffix: '%', icon: '🔥', color: '#4ade80' },
];

export default function StatsCounter({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <section className="py-20 bg-dark-texture relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 120} variant="scale">
              <div className="text-center group relative">
                {/* Circular progress ring */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <CircularProgress value={stat.value} max={stat.suffix === '%' ? 100 : stat.value * 1.5} color={stat.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                      {stat.icon}
                    </span>
                  </div>
                </div>

                <div className="font-heading text-3xl md:text-4xl font-bold text-dark-wood mb-1">
                  <CountUp target={stat.value} />
                  {stat.suffix && <span className="text-gold-light">{stat.suffix}</span>}
                </div>
                <div className="font-heading text-iron-light/60 text-[10px] tracking-[0.15em] uppercase">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
