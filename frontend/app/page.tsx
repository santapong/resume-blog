import Hero from '@/app/components/Hero';
import Skills from '@/app/components/Skills';
import Experience from '@/app/components/Experience';

export const metadata = {
  title: 'Engineer Portfolio | Automation & Software',
  description: 'Specializing in Agentic AI and Bun-based architectures.',
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      
      {/* ID tags allow the "Scroll to" buttons in the Hero to work */}
      <section id="skills">
        <Skills />
      </section>
      
      <section id="experience">
        <Experience />
      </section>
    </main>
  );
}