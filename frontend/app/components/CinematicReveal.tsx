"use client";

import React, { useRef, ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

type Variant = 'fade' | 'slide-up' | 'slide-left' | 'scale';

interface Props {
    children: ReactNode;
    variant?: Variant;
    delay?: number;
    duration?: number;
    className?: string;
    once?: boolean;
}

const variants: Record<Variant, Variants> = {
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    'slide-up': {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 },
    },
    'slide-left': {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
    },
};

// Scroll-triggered reveal using Framer Motion + IntersectionObserver.
// Cinematic easing (custom cubic-bezier) and long 1.1s default duration.
export default function CinematicReveal({
    children,
    variant = 'slide-up',
    delay = 0,
    duration = 1.1,
    className,
    once = true,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once, margin: '-10% 0% -10% 0%' });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants[variant]}
            transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
