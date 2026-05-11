import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import LayoutShell from '@/components/layout/LayoutShell';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tools.dewelope.com'),
  title: {
    default: 'DeWelope Tools - Free Online Utility Tools',
    template: '%s | DeWelope Tools',
  },
  description:
    'Free online tools for developers and everyday use. Unit converters, text tools, calculators, developer utilities, and more.',
  openGraph: {
    siteName: 'DeWelope Tools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    other: {
      'msvalidate.01': 'BING_WEBMASTER_VERIFICATION_CODE',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7840391301182968" />

        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7840391301182968"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
