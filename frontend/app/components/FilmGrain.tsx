"use client";

import React from 'react';

// Global cinematic overlay: film grain + vignette. Both are pointer-events-none
// and fixed to the viewport, so they sit above content without blocking it.
// Respects prefers-reduced-motion via CSS.
export default function FilmGrain() {
    return (
        <>
            <div className="cinematic-vignette" aria-hidden="true" />
            <div className="cinematic-grain" aria-hidden="true" />
        </>
    );
}
