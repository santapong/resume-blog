"use client";

import React, { useEffect, useState } from 'react';
import { getSocials, type SocialLink } from '@/app/lib/api';
import Link from 'next/link';

export default function Footer() {
    const [socials, setSocials] = useState<SocialLink[]>([]);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        getSocials()
            .then(setSocials)
            .catch(() => { });
    }, []);

    return (
        <footer className="bg-dark-texture border-t border-gold-dark/20 relative overflow-hidden">
            {/* Elegant Subdued Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-gold-light/20 to-transparent" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-crimson-light/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

                    {/* Brand/Mark */}
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <span className="text-gold-light text-2xl group-hover:rotate-12 transition-transform duration-500">✧</span>
                            <span className="font-heading text-xl text-parchment-light uppercase tracking-widest">
                                The Mage's Mark
                            </span>
                        </Link>
                        <p className="text-iron-light text-sm leading-relaxed max-w-xs">
                            A chronicle of magic, logic, and the elegant systems that bind the digital realm together.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center max-w-xs mx-auto md:mx-0">
                        <h4 className="font-heading text-sm text-gold-light uppercase tracking-widest mb-6 border-b border-gold-dark/30 pb-2 w-full text-center">
                            Library Index
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-iron-light hover:text-parchment transition-colors text-sm uppercase tracking-wider font-heading">
                                    The Grand Hall
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="text-iron-light hover:text-parchment transition-colors text-sm uppercase tracking-wider font-heading">
                                    Scrolls of Magic
                                </Link>
                            </li>
                            <li>
                                <Link href="/resume" className="text-iron-light hover:text-parchment transition-colors text-sm uppercase tracking-wider font-heading">
                                    The Archmage's Decree
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Magic Links */}
                    <div className="flex flex-col items-center md:items-end w-full">
                        <h4 className="font-heading text-sm text-gold-light uppercase tracking-widest mb-6 border-b border-gold-dark/30 pb-2 w-full max-w-xs text-center md:text-right">
                            Familiars
                        </h4>
                        <div className="flex gap-4">
                            {socials.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-gold-dark/40 flex items-center justify-center text-iron-light hover:text-parchment hover:border-gold-light hover:bg-gold-light/5 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                                    title={social.platform}
                                    aria-label={social.platform}
                                >
                                    <span className="text-lg filter drop-shadow-sm">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gold-dark/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-iron-light font-heading tracking-widest uppercase">
                    <p>&copy; {currentYear} The Mage's Mark. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="w-12 h-px bg-gold-dark/20" />
                        <span className="text-gold-dark">✧ ✧ ✧</span>
                        <span className="w-12 h-px bg-gold-dark/20" />
                    </div>
                    <Link href="/admin" className="hover:text-gold-light transition-colors">
                        Scribe Access
                    </Link>
                </div>
            </div>
        </footer>
    );
}
