import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import StatsCounter from './components/StatsCounter';
import ContactSection from './components/ContactSection';

export const metadata = {
  title: 'Portfolio — The Grand Hall',
  description: 'A knight\'s portfolio, forged in code and presented upon digital parchment. Software & Automation Engineer specializing in Agentic AI and modern web technologies.',
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <StatsCounter />
      <Experience />
      <ContactSection />
    </>
  );
}
