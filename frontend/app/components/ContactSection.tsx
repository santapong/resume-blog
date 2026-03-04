"use client";

import { useEffect, useState } from 'react';
import { getSocials, type SocialLink } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
    const [socials, setSocials] = useState<SocialLink[]>([]);

    useEffect(() => {
        getSocials().then(setSocials).catch(() => { });
    }, []);

    return (
        <section className="py-20 bg-dark-texture relative overflow-hidden">
            {/* Torch glows */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-gold/10 rounded-full torch-glow pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-36 h-36 bg-crimson/8 rounded-full torch-glow pointer-events-none" style={{ animationDelay: '2s' }} />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <h2 className="section-heading-dark mb-4">Send a Raven</h2>
                    <p className="text-center text-parchment/60 mb-12 max-w-lg mx-auto">
                        Seeking a skilled knight for your next quest? Dispatch a raven and thy message shall be received with haste.
                    </p>
                </ScrollReveal>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {socials.map((social, i) => (
                        <ScrollReveal key={social.id} delay={i * 150} variant="scale">
                            <a
                                href={social.url}
                                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="glass-card p-6 text-center block group"
                            >
                                <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
                                    {social.icon}
                                </div>
                                <h3 className="font-heading text-gold font-bold tracking-wider uppercase text-sm mb-1">
                                    {social.platform}
                                </h3>
                                <p className="text-parchment/40 text-xs truncate">
                                    {social.url.replace('mailto:', '').replace('https://', '')}
                                </p>
                            </a>
                        </ScrollReveal>
                    ))}
                </div>

                {socials.length === 0 && (
                    <div className="text-center text-parchment/40 py-8">
                        <p className="font-heading text-sm">No ravens have been trained yet.</p>
                        <p className="text-xs mt-1">Visit the admin chamber to configure social links.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
