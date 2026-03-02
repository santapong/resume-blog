"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Grand Hall', icon: '🏰' },
        { href: '/projects', label: 'Gallery of Conquests', icon: '⚔️' },
        { href: '/resume', label: 'The Royal Decree', icon: '📜' },
    ];

    return (
        <nav className="bg-dark-wood/95 backdrop-blur-sm border-b-2 border-gold sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl">⚜️</span>
                        <span className="font-[family-name:var(--font-heading)] text-gold font-bold text-lg tracking-wider group-hover:text-gold-light transition-colors">
                            PORTFOLIO
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 text-parchment/80 hover:text-gold transition-colors font-[family-name:var(--font-heading)] text-sm tracking-wider uppercase"
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-parchment p-2"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="md:hidden border-t border-gold/30 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-parchment/80 hover:text-gold hover:bg-gold/10 transition-all rounded font-[family-name:var(--font-heading)] text-sm tracking-wider uppercase"
                            >
                                <span className="text-lg">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
