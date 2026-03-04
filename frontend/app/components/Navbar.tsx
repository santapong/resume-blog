"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Grand Hall', icon: '🏰' },
        { href: '/projects', label: 'Conquests', icon: '⚔️' },
        { href: '/resume', label: 'Royal Decree', icon: '📜' },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-500 border-b-2 border-gold ${scrolled
                ? 'bg-dark-wood shadow-[0_4px_20px_rgba(212,168,67,0.15)]'
                : 'bg-dark-wood/90 backdrop-blur-md'
            }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">⚜️</span>
                        <span className="font-heading text-gold font-bold text-lg tracking-wider group-hover:text-gold-light transition-colors">
                            PORTFOLIO
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 font-heading text-sm tracking-wider uppercase ${isActive
                                            ? 'text-gold bg-gold/10 border border-gold/30'
                                            : 'text-parchment/70 hover:text-gold hover:bg-gold/5'
                                        }`}
                                >
                                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-parchment p-2 hover:text-gold transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}>
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="border-t border-gold/30 pt-4 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-heading text-sm tracking-wider uppercase ${isActive
                                            ? 'text-gold bg-gold/10 border border-gold/30'
                                            : 'text-parchment/70 hover:text-gold hover:bg-gold/5'
                                        }`}
                                >
                                    <span className="text-lg">{link.icon}</span>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
