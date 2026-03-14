"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { getProjects, type Project } from '@/app/lib/api';
import ScrollReveal from '@/app/components/ScrollReveal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Get all unique technologies
  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, [projects]);

  const filteredProjects = projects.filter(p => {
    if (filter === 'featured' && !p.featured) return false;
    if (techFilter && !p.technologies.includes(techFilter)) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-parchment-texture text-dark-wood">
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-crimson-light/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-[300px] h-[300px] bg-violet/5 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal>
            <h1 className="section-heading mb-4">Artifacts & Enchantments</h1>
            <p className="text-center text-iron max-w-2xl mx-auto mb-10 text-sm leading-relaxed">
              A collection of mystical creations, each representing a quest undertaken
              and deep knowledge gained.
            </p>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col items-center gap-5 mb-14">
              {/* Main filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-2 rounded-xl font-heading text-xs tracking-wider transition-all ${
                    filter === 'all'
                      ? 'bg-dark-wood text-parchment shadow-lg'
                      : 'bg-parchment-light/40 border border-iron-light/10 text-iron-light hover:text-dark-wood hover:border-iron-light/30'
                  }`}
                >
                  All ({projects.length})
                </button>
                <button
                  onClick={() => setFilter('featured')}
                  className={`px-5 py-2 rounded-xl font-heading text-xs tracking-wider transition-all flex items-center gap-1.5 ${
                    filter === 'featured'
                      ? 'bg-linear-to-r from-gold to-gold-dark text-parchment shadow-lg shadow-gold/20'
                      : 'bg-parchment-light/40 border border-iron-light/10 text-iron-light hover:text-dark-wood hover:border-gold-light/30'
                  }`}
                >
                  Legendary
                </button>
              </div>

              {/* Tech filter chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                {allTechs.map(tech => (
                  <button
                    key={tech}
                    onClick={() => setTechFilter(techFilter === tech ? null : tech)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-heading tracking-wider uppercase transition-all ${
                      techFilter === tech
                        ? 'bg-crimson-light/15 text-crimson-light border border-crimson-light/30'
                        : 'text-iron-light/50 border border-transparent hover:text-iron-light hover:border-iron-light/10'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
                {techFilter && (
                  <button
                    onClick={() => setTechFilter(null)}
                    className="px-3 py-1 rounded-lg text-[10px] font-heading tracking-wider uppercase text-rose border border-rose/30 hover:bg-rose/10 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="scroll-card h-[420px]">
                  <div className="skeleton h-48 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="skeleton h-6 w-3/4 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-28 glass-card max-w-md mx-auto">
              <div className="text-5xl mb-5 opacity-60">📖</div>
              <h3 className="font-heading text-xl text-dark-wood mb-2">No Scrolls Found</h3>
              <p className="text-iron text-sm max-w-sm mx-auto">
                No artifacts match the current filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ScrollReveal key={project.id} delay={index * 100} variant="scale">
                  <div
                    className="scroll-card group h-full flex flex-col cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-aged-paper border-b border-gold-light/10 rounded-t-2xl">
                      {project.imageUrl ? (
                        <>
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-parchment/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-texture">
                          <span className="text-5xl opacity-20">📜</span>
                        </div>
                      )}

                      {project.featured && (
                        <div className="absolute top-3 right-3 bg-linear-to-r from-gold to-gold-dark text-parchment px-3 py-1 text-[10px] font-bold rounded-lg shadow-lg border border-gold-light/30 font-heading tracking-wider uppercase">
                          Legendary
                        </div>
                      )}

                      {/* Quick action overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-10 h-10 rounded-xl bg-dark-wood/90 flex items-center justify-center text-parchment hover:bg-dark-wood transition-colors"
                            title="View Live"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                            </svg>
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-10 h-10 rounded-xl bg-dark-wood/90 flex items-center justify-center text-parchment hover:bg-dark-wood transition-colors"
                            title="View Code"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-heading text-lg text-dark-wood font-bold mb-2 group-hover:text-crimson-light transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-iron text-sm mb-5 flex-grow leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {project.technologies.slice(0, 4).map((tech: string) => (
                          <span key={tech} className="iron-tag text-[10px] border-none">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="iron-tag text-[10px] border-none text-gold-light/60">
                            +{project.technologies.length - 4}
                          </span>
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

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="modal-content w-full max-w-2xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            {selectedProject.imageUrl && (
              <div className="h-56 overflow-hidden rounded-t-[20px]">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-2xl text-dark-wood font-bold">
                    {selectedProject.title}
                  </h2>
                  {selectedProject.featured && (
                    <span className="inline-block mt-2 wax-tag text-[10px]">Legendary Artifact</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 rounded-lg border border-iron-light/10 flex items-center justify-center text-iron-light hover:text-dark-wood hover:border-gold-light/30 transition-colors"
                >
                  &#10005;
                </button>
              </div>

              <p className="text-iron leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              <div className="mb-6">
                <h4 className="font-heading text-xs text-iron-light uppercase tracking-wider mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech: string) => (
                    <span key={tech} className="iron-tag text-xs">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-iron-light/10">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="medieval-btn text-xs flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                    View Live
                  </a>
                )}
                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="medieval-btn-outline text-xs flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                    View Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
