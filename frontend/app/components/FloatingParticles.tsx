"use client";

import { useMemo } from 'react';

export default function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const type = Math.random();
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: type > 0.7 ? 2 + Math.random() * 2 : 1 + Math.random() * 1.5,
        duration: 15 + Math.random() * 25,
        delay: Math.random() * 15,
        opacity: 0.2 + Math.random() * 0.6,
        color: type > 0.7
          ? 'rgba(139, 92, 246, 0.6)'
          : type > 0.4
            ? 'rgba(77, 139, 255, 0.5)'
            : 'rgba(255, 255, 255, 0.4)',
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
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}
