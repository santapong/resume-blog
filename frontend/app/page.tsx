import Hero from '@/app/components/Hero';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';

export const metadata = {
  title: 'The Grand Hall | Medieval Portfolio',
  description: 'A knight\'s portfolio — showcasing skills, experience, and conquests in software engineering.',
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />

      <section id="skills">
        <Skills />
      </section>

      <section id="experience">
        <Experience />
      </section>
    </main>
  );
}