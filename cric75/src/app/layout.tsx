import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { Providers } from '@/components/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cric75.web.app'),
  title: {
    default: 'Cric75 – Modern Cricket Scoring Platform',
    template: '%s | Cric75',
  },
  description:
    'Cric75 is a modern cricket scoring platform for teams, scorers, and fans. Manage teams, record live scores, and share interactive match dashboards in real-time.',
  keywords: [
    'cricket scoring app',
    'cric75',
    'live cricket scores',
    'match analytics',
    'hero ui',
    'next.js',
  ],
  authors: [{ name: 'Cric75' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Cric75 – Modern Cricket Scoring Platform',
    description:
      'Capture ball-by-ball action, manage teams, and share live cricket dashboards with Cric75.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://cric75.web.app',
    siteName: 'Cric75',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@cric75',
    title: 'Cric75 – Modern Cricket Scoring Platform',
    description:
      'Capture ball-by-ball action, manage teams, and share live cricket dashboards with Cric75.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#023344' },
    { media: '(prefers-color-scheme: dark)', color: '#0C2733' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
