"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'Grand Hall', path: '/' },
        { name: 'Scrolls of Magic', path: '/projects' },
        { name: 'Certification', path: '/resume' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-700 ease-in-out ${scrolled
                ? 'bg-parchment/90 backdrop-blur-xl border-b border-gold-light/20 shadow-lg shadow-black/30 py-4'
                : 'bg-transparent py-8'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                {/* Logo/Mark */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className={`text-2xl transition-transform duration-700 ease-out group-hover:rotate-180 ${scrolled ? 'text-gold-light' : 'text-gold-light'}`}>
                        ✧
                    </span>
                    <span className={`font-heading text-xl uppercase tracking-widest font-bold transition-colors ${scrolled ? 'text-dark-wood' : 'text-dark-wood'}`}>
                        Mage's Mark
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`font-heading text-sm uppercase tracking-[0.15em] transition-all duration-300 relative group px-2 py-1 ${isActive(link.path)
                                ? (scrolled ? 'text-crimson' : 'text-crimson')
                                : (scrolled ? 'text-iron hover:text-dark-wood' : 'text-iron hover:text-dark-wood')
                                }`}
                        >
                            <span className="relative z-10">{link.name}</span>
                            {/* Active/Hover Underline */}
                            <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-300 ${isActive(link.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'}`} />
                        </Link>
                    ))}
                    <a
                        href="/#contact"
                        className={`font-heading text-xs uppercase tracking-[0.15em] font-bold px-5 py-2 rounded-full border transition-all duration-300 ${scrolled
                            ? 'border-gold-light/50 text-gold-light hover:bg-gold-light hover:text-parchment'
                            : 'border-gold-light/50 text-gold-light hover:bg-gold-light hover:text-parchment'
                            }`}
                    >
                        Summon Familiar
                    </a>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-2xl focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={scrolled ? 'text-dark-wood' : 'text-dark-wood'}>
                        {mobileMenuOpen ? '✕' : '☰'}
                    </span>
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <div
                className={`md:hidden fixed inset-0 top-[60px] bg-dark-texture backdrop-blur-xl border-t transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'border-gold-light/20 opacity-100 visible translate-y-0' : 'border-transparent opacity-0 invisible -translate-y-4'
                    }`}
            >
                <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] gap-10">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`font-heading text-2xl uppercase tracking-widest ${isActive(link.path)
                                ? 'text-gold-light border-b-2 border-gold-light pb-2'
                                : 'text-parchment-light/70 hover:text-parchment-light'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href="/#contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mt-8 font-heading text-sm uppercase tracking-widest font-bold px-8 py-3 rounded-full border border-gold-light text-gold-light hover:bg-gold-light hover:text-parchment transition-colors"
                    >
                        Summon Familiar
                    </a>
                </div>
            </div>
        </header>
    );
}
