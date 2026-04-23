"use client";

import { useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;        // base y-drift per frame
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  depth: 0 | 1 | 2;     // 0 = far (dim, no twinkle), 1 = mid, 2 = near (with glow)
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;        // rgba inner color (trailing comma, alpha appended at paint)
  driftX: number;
  driftY: number;
  phase: number;
}

const STAR_COLORS = [
  'rgba(255, 255, 255,',
  'rgba(200, 210, 255,',
  'rgba(180, 200, 255,',
  'rgba(255, 200, 150,',
  'rgba(200, 180, 255,',
];

const NEBULA_COLORS = [
  'rgba(139, 92, 246,',   // purple
  'rgba(77, 139, 255,',   // blue
  'rgba(236, 72, 153,',   // pink
  'rgba(34, 211, 238,',   // cyan — used sparingly
];

export default function CosmicStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let nebulae: Nebula[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initNebulae();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 7000);
      stars = Array.from({ length: count }, () => {
        // Depth distribution: 50% far, 35% mid, 15% near.
        const roll = Math.random();
        const depth: 0 | 1 | 2 = roll < 0.5 ? 0 : roll < 0.85 ? 1 : 2;
        const baseSize = depth === 0 ? 0.4 : depth === 1 ? 1.0 : 1.6;
        const jitter = Math.random() * 0.6;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: baseSize + jitter,
          speed: depth === 0 ? 0.02 : depth === 1 ? 0.08 : 0.18,
          opacity: depth === 0 ? 0.35 + Math.random() * 0.25 : 0.5 + Math.random() * 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          depth,
        };
      });
    };

    const initNebulae = () => {
      // 3–4 drifting colour clouds. Large and very soft.
      const count = canvas.width < 768 ? 2 : canvas.width < 1280 ? 3 : 4;
      nebulae = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: canvas.width * (0.35 + Math.random() * 0.25),
        color: NEBULA_COLORS[i % NEBULA_COLORS.length],
        driftX: (Math.random() - 0.5) * 0.04,
        driftY: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      // ── Draw nebulae first so stars sit on top ───────────────────
      for (const n of nebulae) {
        // Gentle breathing opacity so clouds pulse over minutes.
        const breathe = Math.sin(time * 0.0015 + n.phase) * 0.015 + 0.035;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, `${n.color} ${breathe})`);
        grad.addColorStop(0.55, `${n.color} ${breathe * 0.35})`);
        grad.addColorStop(1, `${n.color} 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Drift + gentle wrap.
        n.x += n.driftX;
        n.y += n.driftY;
        if (n.x < -n.radius) n.x = canvas.width + n.radius;
        if (n.x > canvas.width + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = canvas.height + n.radius;
        if (n.y > canvas.height + n.radius) n.y = -n.radius;
      }

      // ── Draw stars with depth-aware rendering ────────────────────
      for (const star of stars) {
        const twinkle = star.depth === 0
          ? 1
          : Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color} ${alpha})`;
        ctx.fill();

        // Only near-depth (glowing) stars get a bloom halo.
        if (star.depth === 2 && star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color} ${alpha * 0.12})`;
          ctx.fill();
        }

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cosmic-starfield cinematic-slow-zoom"
      aria-hidden="true"
    />
  );
}
