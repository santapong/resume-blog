"use client";

import { useMemo } from 'react';

export default function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const isStar = Math.random() > 0.5;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: isStar ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.6
          ? 'rgba(167, 139, 250, 0.6)'
          : Math.random() > 0.3
            ? 'rgba(108, 180, 238, 0.6)'
            : 'rgba(232, 184, 75, 0.5)',
        isStar,
      };
    });
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
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            clipPath: p.isStar
              ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              : 'circle(50%)',
          }}
        />
      ))}
    </div>
  );
}
