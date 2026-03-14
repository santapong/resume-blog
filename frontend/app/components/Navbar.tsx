"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { name: 'Grand Hall', path: '/' },
    { name: 'Artifacts', path: '/projects' },
    { name: 'Decree', path: '/resume' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-parchment/80 backdrop-blur-2xl border-b border-gold-light/10 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      {/* Scroll progress bar */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 h-[1px] bg-linear-to-r from-gold via-crimson to-violet transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className={`text-xl transition-all duration-500 group-hover:rotate-180 group-hover:scale-110 ${scrolled ? 'text-gold' : 'text-gold-light'}`}>
            &#10023;
          </span>
          <span className="font-heading text-lg uppercase tracking-[0.2em] font-bold text-dark-wood">
            Mage&apos;s Mark
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-heading text-[11px] uppercase tracking-[0.15em] transition-all duration-300 relative px-4 py-2 rounded-lg group ${
                isActive(link.path)
                  ? 'text-gold-light bg-gold-light/5'
                  : 'text-iron-light hover:text-dark-wood hover:bg-dark-wood/5'
              }`}
            >
              <span className="relative z-10">{link.name}</span>
              {isActive(link.path) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-light" />
              )}
            </Link>
          ))}
          <a
            href="/#contact"
            className="ml-4 font-heading text-[11px] uppercase tracking-[0.15em] font-bold px-5 py-2.5 rounded-xl border border-gold-light/30 text-gold-light hover:bg-gold-light hover:text-parchment transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
          >
            Contact
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-dark-wood/5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-[1.5px] bg-dark-wood transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-[1.5px] bg-dark-wood transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block h-[1.5px] bg-dark-wood transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden fixed inset-0 top-[52px] bg-parchment/95 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] gap-8">
          {links.map((link, i) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`font-heading text-2xl uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-gold-light'
                  : 'text-iron-light hover:text-dark-wood'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {link.name}
              {isActive(link.path) && (
                <div className="h-px w-full bg-linear-to-r from-transparent via-gold-light to-transparent mt-2" />
              )}
            </Link>
          ))}
          <a
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 font-heading text-sm uppercase tracking-widest font-bold px-8 py-3 rounded-xl border border-gold-light/30 text-gold-light hover:bg-gold-light hover:text-parchment transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
