"use client";

import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

interface Stat {
    value: number;
    label: string;
    suffix?: string;
    icon: string;
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
                        // Ease-out cubic
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

const defaultStats: Stat[] = [
    { value: 3, label: 'Years of Service', suffix: '+', icon: '⏳' },
    { value: 10, label: 'Quests Completed', suffix: '+', icon: '⚔️' },
    { value: 15, label: 'Weapons Mastered', suffix: '+', icon: '🛡️' },
    { value: 99, label: 'Dedication', suffix: '%', icon: '🔥' },
];

export default function StatsCounter({ stats = defaultStats }: { stats?: Stat[] }) {
    return (
        <section className="py-16 bg-dark-texture relative overflow-hidden">
            {/* Top/Bottom ornamental lines */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-gold to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-gold to-transparent" />

            <div className="max-w-5xl mx-auto px-6">
                <h2 className="section-heading-dark mb-12">Feats of Valor</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <ScrollReveal key={stat.label} delay={i * 100} variant="scale">
                            <div className="text-center group">
                                <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-125">
                                    {stat.icon}
                                </div>
                                <div className="font-heading text-4xl md:text-5xl font-bold text-gold-gradient mb-2">
                                    <CountUp target={stat.value} />
                                    {stat.suffix && <span>{stat.suffix}</span>}
                                </div>
                                <div className="font-heading text-parchment/60 text-xs tracking-[0.15em] uppercase">
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
