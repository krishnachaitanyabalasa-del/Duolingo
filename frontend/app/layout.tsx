import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppLayoutClient } from '@/components/layout/AppLayoutClient';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Duolingo - Learn Languages Free',
  description: 'Learn languages with playful, bite-sized lessons inspired by Duolingo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}>
        <AppLayoutClient>{children}</AppLayoutClient>
      </body>
    </html>
  );
}
