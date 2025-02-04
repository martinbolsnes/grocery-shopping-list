import type { Metadata } from 'next';
import { Shrikhand, Cabin_Condensed } from 'next/font/google';
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
      <body className={`${shrikhand.variable} ${cabin.className} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
