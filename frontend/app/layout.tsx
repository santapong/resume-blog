import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CosmicStarfield from '@/app/components/CosmicStarfield';

export const metadata = {
  title: 'Cosmic Portfolio | Software & Automation Engineer',
  description: 'A cosmic portfolio — showcasing experience, skills, and achievements in software engineering across the digital universe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CosmicStarfield />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
