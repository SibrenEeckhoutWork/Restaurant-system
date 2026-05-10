import type { Metadata } from 'next';
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'De Zoete Wever — Ontbijt & koffie in Roeselare',
  description:
    'Een huiselijk ontbijt- en koffiehuis in Roeselare. Home made granola, pancakes, traditioneel ontbijt en barista-koffie. Sinds altijd op het Stationplein.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServicesProvider>{children}</ServicesProvider>
      </body>
    </html>
  );
}
