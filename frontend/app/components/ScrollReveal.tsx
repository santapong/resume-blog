"use client";

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    variant?: 'up' | 'left' | 'scale';
    delay?: number;
}

export default function ScrollReveal({ children, className = '', variant = 'up', delay = 0 }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    const variantClass = {
        up: 'scroll-reveal',
        left: 'scroll-reveal-left',
        scale: 'scroll-reveal-scale',
    }[variant];

    return (
        <div ref={ref} className={`${variantClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}
