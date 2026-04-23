"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
    act: string;       // Roman numeral, e.g. "I", "II"
    title: string;     // Short act name, e.g. "ORIGINS"
    epigraph?: string; // Optional one-line subtitle / tagline
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Cinematic act card — appears between sections as a title card.
export default function SectionTitleCard({ act, title, epigraph }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-20% 0% -20% 0%' });

    return (
        <div
            ref={ref}
            className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center"
        >
            <motion.span
                initial={{ opacity: 0, letterSpacing: '1em' }}
                animate={inView ? { opacity: 1, letterSpacing: '0.4em' } : {}}
                transition={{ duration: 1.8, ease: EASE }}
                className="font-heading text-[10px] md:text-xs text-nebula-purple-light/70 uppercase mb-8 tracking-[0.4em]"
            >
                Act {act}
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                className="font-heading text-4xl md:text-6xl lg:text-7xl text-starlight tracking-[0.15em] uppercase font-light"
            >
                {title}
            </motion.h2>

            {epigraph && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.2, delay: 0.8 }}
                    className="mt-6 text-stardust text-sm md:text-base max-w-md tracking-wider italic"
                >
                    {epigraph}
                </motion.p>
            )}

            <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
                className="mt-10 h-px w-40 bg-linear-to-r from-transparent via-nebula-purple-light/60 to-transparent origin-center"
            />
        </div>
    );
}
