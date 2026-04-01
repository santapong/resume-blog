"use client";

import React, { useEffect, useState } from 'react';
import { getSocials, type SocialLink } from '@/app/lib/api';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({ name: '', subject: '', message: '' });
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  useEffect(() => {
    getSocials()
      .then(setSocials)
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLink = socials.find(s => s.url.startsWith('mailto:'));
    const email = emailLink ? emailLink.url.replace('mailto:', '') : 'hello@example.com';
    const subject = encodeURIComponent(formData.subject || 'New Mission Proposal');
    const body = encodeURIComponent(`From: ${formData.name}\n\n${formData.message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="py-28 bg-dark-texture relative overflow-hidden" id="contact">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-nebula-purple/30 to-transparent" />

      {/* Background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-nebula-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-nebula-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="section-heading-dark mb-4">Open a Channel</h2>
            <p className="text-stardust-light max-w-lg mx-auto leading-relaxed text-sm">
              Whether you seek collaboration, have a mission to propose, or simply wish to
              connect, I am always open to receiving transmissions.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <ScrollReveal delay={100} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-nebula-purple/15 to-nebula-blue/15 flex items-center justify-center border border-nebula-purple/10">
                  <span className="text-xl">📡</span>
                </div>
                <h3 className="font-heading text-lg text-starlight">Send Transmission</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stardust-light text-xs font-heading tracking-wider uppercase mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    placeholder="Enter your name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-stardust-light text-xs font-heading tracking-wider uppercase mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="admin-input"
                    placeholder="Mission proposal..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-stardust-light text-xs font-heading tracking-wider uppercase mb-2">
                  Your Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="admin-input resize-none"
                  placeholder="Describe your mission or proposal..."
                  required
                />
              </div>

              <button type="submit" className="medieval-btn w-full text-sm">
                Transmit Message
              </button>
            </form>
          </ScrollReveal>

          {/* Social Links */}
          <ScrollReveal delay={200} className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-nebula-blue/15 to-nebula-purple/15 flex items-center justify-center border border-nebula-blue/10">
                  <span className="text-xl">🔗</span>
                </div>
                <h3 className="font-heading text-lg text-starlight">Find Me</h3>
              </div>

              {socials.filter(s => !s.url.startsWith('mailto:')).map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card flex items-center gap-4 p-5 group"
                  onMouseEnter={() => setHoveredSocial(social.id)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <span className={`text-3xl transition-transform duration-300 ${hoveredSocial === social.id ? 'scale-125' : ''}`}>
                    {social.icon}
                  </span>
                  <div className="flex-1">
                    <span className="font-heading text-starlight text-sm font-bold tracking-wide block group-hover:text-nebula-purple-light transition-colors">
                      {social.platform}
                    </span>
                    <span className="text-stardust-light/50 text-xs truncate block">
                      {social.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-stardust-light/30 group-hover:text-nebula-purple-light group-hover:translate-x-1 transition-all"
                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              ))}

              {/* Email CTA */}
              {socials.find(s => s.url.startsWith('mailto:')) && (
                <a
                  href={socials.find(s => s.url.startsWith('mailto:'))!.url}
                  className="glass-card flex items-center gap-4 p-5 group border-nebula-purple/10!"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">📧</span>
                  <div className="flex-1">
                    <span className="font-heading text-nebula-purple-light text-sm font-bold tracking-wide block">
                      Email Directly
                    </span>
                    <span className="text-stardust-light/50 text-xs">Preferred method of contact</span>
                  </div>
                </a>
              )}
            </div>

            <p className="text-stardust-light/40 text-[10px] mt-6 font-heading tracking-widest uppercase text-center">
              Response typical within 24 hours
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
