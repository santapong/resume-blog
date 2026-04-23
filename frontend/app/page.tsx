"use client";

import './cinematic.css';
import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import StatsCounter from './components/StatsCounter';
import ContactSection from './components/ContactSection';
import CinematicReveal from './components/CinematicReveal';
import SectionTitleCard from './components/SectionTitleCard';
import FilmGrain from './components/FilmGrain';
import { getConfig, type SectionLayout } from './lib/api';

const sectionComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  skills: Skills,
  stats: StatsCounter,
  experience: Experience,
  contact: ContactSection,
};

// Cinematic act cards inserted BEFORE the given section id.
const actCards: Record<string, { act: string; title: string; epigraph: string }> = {
  about:      { act: 'I',   title: 'ORIGINS',      epigraph: 'Who stands behind the signal.' },
  skills:     { act: 'II',  title: 'ARSENAL',      epigraph: 'Instruments of the craft.' },
  experience: { act: 'III', title: 'JOURNEY',      epigraph: 'Missions undertaken across the dark.' },
  contact:    { act: 'IV',  title: 'TRANSMISSION', epigraph: 'Open a channel.' },
};

const defaultLayout: SectionLayout[] = [
  { id: 'hero', visible: true },
  { id: 'about', visible: true },
  { id: 'skills', visible: true },
  { id: 'stats', visible: true },
  { id: 'experience', visible: true },
  { id: 'contact', visible: true },
];

export default function Home() {
  const [layout, setLayout] = useState<SectionLayout[]>(defaultLayout);

  useEffect(() => {
    getConfig()
      .then((config) => {
        if (config.sectionLayout) {
          try {
            const parsed = JSON.parse(config.sectionLayout);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLayout(parsed);
            }
          } catch {
            // use default
          }
        }
      })
      .catch(() => {});
  }, []);

  const visibleSections = layout.filter((s) => s.visible);

  return (
    <>
      <FilmGrain />
      <div className="cinematic-grade">
        {visibleSections.map((section) => {
          const Component = sectionComponents[section.id];
          if (!Component) return null;

          // Hero renders bare (it has its own cinematic entrance + letterbox).
          if (section.id === 'hero') {
            return <Component key={section.id} />;
          }

          const card = actCards[section.id];
          return (
            <div key={section.id}>
              {card && (
                <SectionTitleCard
                  act={card.act}
                  title={card.title}
                  epigraph={card.epigraph}
                />
              )}
              <CinematicReveal variant="slide-up" duration={1.2}>
                <Component />
              </CinematicReveal>
            </div>
          );
        })}
      </div>
    </>
  );
}
