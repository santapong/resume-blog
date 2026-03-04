"use client";

import React, { useEffect, useState } from 'react';
import { getProjects, type Project } from '@/app/lib/api';
import ScrollReveal from '@/app/components/ScrollReveal';

type Filter = 'all' | 'featured';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('all');

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filteredProjects = filter === 'featured'
        ? projects.filter(p => p.featured)
        : projects;

    return (
        <main className="min-h-screen bg-parchment-texture">
            {/* Header Section */}
            <section className="py-16 px-6 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold/5 blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <ScrollReveal>
                        <h1 className="section-heading mb-4">Gallery of Conquests</h1>
                        <p className="text-iron max-w-2xl mx-auto mb-8">
                            Behold the works forged in the fires of innovation — each project a testament to skill and determination.
                        </p>
                    </ScrollReveal>

                    {/* Filter Tabs */}
                    {projects.some(p => p.featured) && (
                        <ScrollReveal delay={200}>
                            <div className="inline-flex border border-gold/40 rounded overflow-hidden">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-2 font-heading text-xs tracking-wider uppercase transition-all duration-300 ${filter === 'all'
                                            ? 'bg-gold text-dark-wood'
                                            : 'text-iron hover:bg-gold/10'
                                        }`}
                                >
                                    All Conquests
                                </button>
                                <button
                                    onClick={() => setFilter('featured')}
                                    className={`px-6 py-2 font-heading text-xs tracking-wider uppercase transition-all duration-300 ${filter === 'featured'
                                            ? 'bg-gold text-dark-wood'
                                            : 'text-iron hover:bg-gold/10'
                                        }`}
                                >
                                    ⭐ Featured
                                </button>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton h-80 rounded" />
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏰</div>
                            <p className="font-heading text-xl text-dark-wood mb-2">
                                {filter === 'featured' ? 'No Featured Conquests' : 'The Gallery Awaits'}
                            </p>
                            <p className="text-iron">
                                {filter === 'featured'
                                    ? 'No conquests have been marked as featured yet.'
                                    : 'No conquests have been recorded yet. Return soon to witness great feats.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, index) => (
                                <ScrollReveal key={project.id} delay={index * 100} variant="scale">
                                    <div
                                        className={`scroll-card overflow-hidden group ${project.featured ? 'ring-2 ring-gold' : ''
                                            }`}
                                    >
                                        {/* Featured Badge */}
                                        {project.featured && (
                                            <div className="bg-gold text-dark-wood text-xs font-heading font-bold tracking-wider uppercase px-3 py-1.5 text-center">
                                                ⭐ Featured Conquest
                                            </div>
                                        )}

                                        {/* Image with hover zoom */}
                                        {project.imageUrl ? (
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-dark-wood/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-dark-wood/10 flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute inset-0 bg-linear-to-br from-gold/5 to-crimson/5" />
                                                <span className="text-5xl opacity-30 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">⚔️</span>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="font-heading text-lg font-bold text-dark-wood mb-2 group-hover:text-crimson transition-colors duration-300">
                                                {project.title}
                                            </h3>
                                            <p className="text-iron text-sm leading-relaxed mb-4 line-clamp-3">
                                                {project.description}
                                            </p>

                                            {/* Technologies */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {project.technologies.map((tech: string) => (
                                                    <span key={tech} className="iron-tag text-[10px]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Links */}
                                            <div className="flex gap-3">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="medieval-btn text-xs py-2! px-4!"
                                                    >
                                                        🌐 View Live
                                                    </a>
                                                )}
                                                {project.repoUrl && (
                                                    <a
                                                        href={project.repoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="medieval-btn-outline text-xs py-2! px-4!"
                                                    >
                                                        📂 Source
                                                    </a>
                                                )}
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
