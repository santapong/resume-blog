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
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-aged-paper/80 border-t border-gold-dark/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-linear-to-r from-transparent via-gold-light/15 to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-crimson-light/3 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="text-gold text-xl group-hover:rotate-180 transition-transform duration-700">&#10023;</span>
              <span className="font-heading text-lg text-dark-wood uppercase tracking-[0.2em]">
                The Mage&apos;s Mark
              </span>
            </Link>
            <p className="text-iron-light text-sm leading-relaxed max-w-xs">
              A chronicle of magic, logic, and the elegant systems that bind the digital realm together.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col items-center">
            <h4 className="font-heading text-[11px] text-gold-light/70 uppercase tracking-[0.2em] mb-5">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Grand Hall', path: '/' },
                { name: 'Artifacts', path: '/projects' },
                { name: 'Decree', path: '/resume' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-iron-light hover:text-dark-wood transition-colors text-sm font-heading tracking-wider"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-heading text-[11px] text-gold-light/70 uppercase tracking-[0.2em] mb-5">
              Connect
            </h4>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-iron-light/10 flex items-center justify-center text-iron-light hover:text-dark-wood hover:border-gold-light/30 hover:bg-gold-light/5 transition-all duration-300 hover:-translate-y-1"
                  title={social.platform}
                  aria-label={social.platform}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-iron-light/5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-iron-light/40 font-heading tracking-[0.2em] uppercase">
          <p>&copy; {currentYear} The Mage&apos;s Mark</p>
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold-dark/10" />
            <span className="text-gold-dark/30">&#10023;</span>
            <span className="w-8 h-px bg-gold-dark/10" />
          </div>
          <Link href="/admin" className="hover:text-gold-light transition-colors">
            Scribe Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
