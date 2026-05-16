import type { Metadata } from 'next';
import { Instrument_Serif, Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond, Nunito, Raleway } from 'next/font/google';
import { ServicesProvider } from '@/context/ServicesContext';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  title: 'De Zoete Wever — Ontbijt & koffie in Roeselare',
  description:
    'Een huiselijk ontbijt- en koffiehuis in Roeselare. Home made granola, pancakes, traditioneel ontbijt en barista-koffie. Sinds altijd op het Stationplein.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} ${nunito.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServicesProvider>{children}</ServicesProvider>
      </body>
    </html>
  );
}
