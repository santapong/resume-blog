"use client";

import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import StatsCounter from './components/StatsCounter';
import ContactSection from './components/ContactSection';
import { getConfig, type SectionLayout } from './lib/api';

const sectionComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  skills: Skills,
  stats: StatsCounter,
  experience: Experience,
  contact: ContactSection,
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

  return (
    <>
      {layout
        .filter((section) => section.visible)
        .map((section) => {
          const Component = sectionComponents[section.id];
          if (!Component) return null;
          return <Component key={section.id} />;
        })}
    </>
  );
}
