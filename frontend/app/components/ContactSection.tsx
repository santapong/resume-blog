"use client";

import React, { useEffect, useState } from 'react';
import { getSocials, type SocialLink } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
    const [socials, setSocials] = useState<SocialLink[]>([]);

    useEffect(() => {
        getSocials()
            .then(setSocials)
            .catch(() => { });
    }, []);

    const handleEmail = () => {
        const emailLink = socials.find(s => s.url.startsWith('mailto:'));
        if (emailLink) {
            window.location.href = emailLink.url;
        } else {
            window.location.href = 'mailto:hello@example.com';
        }
    };

    return (
        <section className="py-24 bg-dark-texture relative overflow-hidden" id="contact">
            {/* Elegant Top Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gold-dark/40 to-transparent" />

            {/* Subtle magical aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mana-glow opacity-10 blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="text-4xl mb-6 inline-block filter drop-shadow opacity-90">🕊️</span>
                        <h2 className="section-heading-dark mb-4">Summon a Familiar</h2>
                        <p className="text-iron-light max-w-lg mx-auto leading-relaxed text-[15px]">
                            Whether you seek an alliance, have a quest to offer, or simply wish to
                            share tales from your travels, I am always open to receiving magical missives from afar.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
                        {socials.filter(s => !s.url.startsWith('mailto:')).map((social) => (
                            <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-card flex flex-col items-center justify-center p-8 gap-4 group"
                            >
                                <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                                    {social.icon}
                                </span>
                                <span className="font-heading text-parchment-light uppercase tracking-widest text-sm font-bold group-hover:text-gold-light transition-colors">
                                    {social.platform}
                                </span>
                                {/* Small hover glint */}
                                <div className="w-8 h-px bg-gold-dark/0 group-hover:bg-gold-light/60 transition-all duration-300 mt-2" />
                            </a>
                        ))}
                    </div>

                    {/* Central Call to Action */}
                    <div className="text-center">
                        <button
                            onClick={handleEmail}
                            className="medieval-btn group relative overflow-hidden px-10! py-4! text-sm!"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <span className="text-xl">✨</span> Cast Missive Spell
                            </span>
                        </button>
                        <p className="text-iron-light/50 text-xs mt-6 font-heading tracking-widest uppercase">
                            Response typical within one moons turn
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
