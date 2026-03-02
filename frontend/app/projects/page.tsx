"use client";

import React, { useEffect, useState } from 'react';
import { getProjects, type Project } from '@/app/lib/api';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProjects()
            .then(setProjects)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-parchment-texture">
            {/* Header Section */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="section-heading mb-4">Gallery of Conquests</h1>
                    <p className="text-iron max-w-2xl mx-auto">
                        Behold the works forged in the fires of innovation — each project a testament to skill and determination.
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="text-center text-iron/60 py-12">
                            <p className="font-[family-name:var(--font-heading)]">Preparing the gallery...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏰</div>
                            <p className="font-[family-name:var(--font-heading)] text-xl text-dark-wood mb-2">
                                The Gallery Awaits
                            </p>
                            <p className="text-iron">
                                No conquests have been recorded yet. Return soon to witness great feats.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    className={`scroll-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up ${project.featured ? 'ring-2 ring-gold' : ''
                                        }`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Featured Badge */}
                                    {project.featured && (
                                        <div className="bg-gold text-dark-wood text-xs font-[family-name:var(--font-heading)] font-bold tracking-wider uppercase px-3 py-1 text-center">
                                            ⭐ Featured Conquest
                                        </div>
                                    )}

                                    {/* Image Placeholder */}
                                    {project.imageUrl ? (
                                        <div className="h-48 bg-dark-wood/10 overflow-hidden">
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-dark-wood/10 flex items-center justify-center">
                                            <span className="text-5xl opacity-30">⚔️</span>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-dark-wood mb-2">
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
                                                    className="medieval-btn text-xs !py-2 !px-4"
                                                >
                                                    🌐 View Live
                                                </a>
                                            )}
                                            {project.repoUrl && (
                                                <a
                                                    href={project.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="medieval-btn-outline text-xs !py-2 !px-4"
                                                >
                                                    📂 Source
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
