import './globals.css';
import { Cinzel, IM_Fell_English } from 'next/font/google';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const imFell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-im-fell',
  display: 'swap',
});

export const metadata = {
  title: 'Medieval Portfolio | Software & Automation Engineer',
  description: 'A knight\'s portfolio — showcasing experience, skills, and conquests in software engineering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cinzel.variable} ${imFell.variable} font-[family-name:var(--font-im-fell)] antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}