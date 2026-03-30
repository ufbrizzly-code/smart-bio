import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Link — Beyond the Bio Link',
  description: 'The most advanced digital presence for creative entities. Dynamic link optimization, real-time analytics, and automated boutiques.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full bg-[#020617] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
