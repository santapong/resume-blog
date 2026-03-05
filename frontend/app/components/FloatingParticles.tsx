"use client";

import { useMemo } from 'react';

export default function FloatingParticles({ count = 20 }: { count?: number }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 3 + Math.random() * 5, // Slightly larger for star shapes
            duration: 10 + Math.random() * 15, // Slower, more ethereal floating
            delay: Math.random() * 10,
            opacity: 0.4 + Math.random() * 0.6,
        }));
    }, [count]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="ember"
                    style={{
                        left: p.left,
                        bottom: '-20px',
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
}
