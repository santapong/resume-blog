"use client";

import React, { useEffect, useState } from 'react';
import { getProjects, type Project } from '@/app/lib/api';
import ScrollReveal from '@/app/components/ScrollReveal';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filteredProjects = projects.filter(p => filter === 'all' || (filter === 'featured' && p.featured));

    return (
        <main className="min-h-screen bg-parchment-texture text-dark-wood">
            <section className="pt-32 pb-24 px-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-crimson-light/5 blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <ScrollReveal>
                        <h1 className="section-heading mb-4">Artifacts & Enchantments</h1>
                        <p className="text-center text-iron max-w-2xl mx-auto mb-12 text-[15px] leading-relaxed">
                            A collection of mystical creations, artifacts woven from logic and spells,
                            each representing a quest undertaken and deep knowledge gained over centuries.
                        </p>
                    </ScrollReveal>

                    {/* Filter Tabs */}
                    <ScrollReveal delay={150}>
                        <div className="flex justify-center gap-4 mb-16">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-6 py-2 rounded-full font-heading text-sm tracking-wide transition-all ${filter === 'all'
                                    ? 'bg-dark-wood text-parchment-light shadow-md'
                                    : 'bg-parchment border border-gold-light/40 text-iron hover:bg-aged-paper hover:text-dark-wood'
                                    }`}
                            >
                                All Grimoires
                            </button>
                            <button
                                onClick={() => setFilter('featured')}
                                className={`px-6 py-2 rounded-full font-heading text-sm tracking-wide transition-all flex items-center gap-2 ${filter === 'featured'
                                    ? 'bg-linear-to-r from-gold to-gold-dark text-parchment-light shadow-md shadow-gold/20'
                                    : 'bg-parchment border border-gold-light/40 text-iron hover:bg-aged-paper hover:text-dark-wood'
                                    }`}
                            >
                                ✨ Legendary Artifacts
                            </button>
                        </div>
                    </ScrollReveal>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="scroll-card h-[450px]">
                                    <div className="skeleton h-48 rounded-t-lg" />
                                    <div className="p-6 space-y-4">
                                        <div className="skeleton h-6 w-3/4 rounded" />
                                        <div className="skeleton h-4 w-full rounded" />
                                        <div className="skeleton h-4 w-5/6 rounded" />
                                        <div className="pt-4 flex gap-2">
                                            <div className="skeleton h-6 w-16 rounded-full" />
                                            <div className="skeleton h-6 w-16 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-32 scroll-card glass-card">
                            <div className="text-6xl mb-6 opacity-80">📖</div>
                            <h3 className="font-heading text-2xl text-dark-wood mb-3">No Scrolls Found</h3>
                            <p className="text-iron max-w-sm mx-auto">
                                The grand library seems empty of such artifacts at this moment.
                                Perhaps the scribes are still working on them.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <ScrollReveal key={project.id} delay={index * 150} variant="scale">
                                    <div className="scroll-card group h-full flex flex-col hover:border-crimson-light/40">
                                        {/* Image Section */}
                                        <div className="relative h-56 overflow-hidden bg-aged-paper border-b border-gold-light/30 rounded-t-lg">
                                            {project.imageUrl ? (
                                                <>
                                                    <img
                                                        src={project.imageUrl}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-dark-wood/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-dark-texture">
                                                    <span className="text-5xl opacity-40 filter drop-shadow">📜</span>
                                                </div>
                                            )}

                                            {/* Featured Badge */}
                                            {project.featured && (
                                                <div className="absolute top-3 right-3 bg-linear-to-r from-gold to-gold-dark text-parchment-light px-3 py-1 text-xs font-bold rounded-full shadow-lg border border-gold-light">
                                                    ✨ Artifact
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="font-heading text-xl text-dark-wood font-bold mb-3 group-hover:text-crimson transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-iron text-sm mb-6 flex-grow leading-relaxed">
                                                {project.description}
                                            </p>

                                            <div className="space-y-6 mt-auto">
                                                {/* Built with */}
                                                <div>
                                                    <p className="text-[10px] text-iron-light uppercase font-bold tracking-wider mb-2">Incantations & Runes</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {project.technologies.slice(0, 4).map((tech: string) => (
                                                            <span key={tech} className="iron-tag text-[10px] border-none bg-parchment-light">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                        {project.technologies.length > 4 && (
                                                            <span className="iron-tag text-[10px] border-none bg-parchment-light">
                                                                +{project.technologies.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Links */}
                                                <div className="flex gap-4 pt-4 border-t border-iron-light/20">
                                                    {project.liveUrl && (
                                                        <a
                                                            href={project.liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-heading font-bold text-crimson hover:text-crimson-light transition-colors flex items-center gap-1"
                                                        >
                                                            <span>🌐</span> Scry View
                                                        </a>
                                                    )}
                                                    {project.repoUrl && (
                                                        <a
                                                            href={project.repoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-heading font-bold text-gold-dark hover:text-gold transition-colors flex items-center gap-1"
                                                        >
                                                            <span>📜</span> View Tome
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
