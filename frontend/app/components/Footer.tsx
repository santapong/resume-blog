"use client";

import { useEffect, useState } from 'react';
import { getSocials, type SocialLink } from '@/app/lib/api';

export default function Footer() {
    const [socials, setSocials] = useState<SocialLink[]>([]);

    useEffect(() => {
        getSocials().then(setSocials).catch(() => { });
    }, []);

    return (
        <footer className="bg-dark-wood border-t-2 border-gold relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gold/5 blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
                {/* Decorative top */}
                <div className="flex justify-center mb-6">
                    <span className="text-gold text-2xl animate-pulse">⚜️</span>
                </div>

                {/* Social Links */}
                {socials.length > 0 && (
                    <div className="flex justify-center gap-4 mb-6">
                        {socials.map((social) => (
                            <a
                                key={social.id}
                                href={social.url}
                                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/30 text-lg hover:bg-gold/20 hover:border-gold hover:scale-110 transition-all duration-300"
                                title={social.platform}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="text-center space-y-3">
                    <p className="font-heading text-gold text-sm tracking-[0.2em] uppercase">
                        The Scribe&apos;s Mark
                    </p>
                    <p className="text-parchment/60 text-sm">
                        Forged with dedication and craftsmanship
                    </p>
                    <p className="text-parchment/40 text-xs">
                        &copy; {new Date().getFullYear()} &middot; All rights reserved
                    </p>
                </div>

                {/* Decorative bottom */}
                <div className="mt-6 flex items-center gap-3 justify-center">
                    <div className="h-px w-20 bg-linear-to-r from-transparent to-gold/50" />
                    <span className="text-gold/50 text-xs">✦ ✦ ✦</span>
                    <div className="h-px w-20 bg-linear-to-l from-transparent to-gold/50" />
                </div>
            </div>
        </footer>
    );
}
