import type { Metadata } from 'next';
import {
  Shrikhand,
  Cabin_Condensed,
  Fira_Sans_Condensed,
} from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Header from './components/Header';
import { Toaster } from '@/components/ui/toaster';

const shrikhand = Shrikhand({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shrikhand',
});
const cabin = Cabin_Condensed({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-cabin',
});

const fira = Fira_Sans_Condensed({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-fira',
});

export const metadata: Metadata = {
  title: 'Lista',
  description: 'Din eneste for app for dine lister',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${shrikhand.variable} ${cabin.variable} ${fira.variable} antialiased`}
      >
        <SessionProvider>
          <Header />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
