import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { GlobalProvider } from '@/providers';
import { RootLayoutProps } from '@/types';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5b21b6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e0533' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: '🔥 Predição de Risco de Fogo | Mossoró/RN',
    template: '%s | Fire Risk ML',
  },
  description:
    'Sistema inteligente de predição de risco de incêndios florestais baseado em Machine Learning, utilizando dados do BDQueimadas (INPE) para a região de Mossoró/RN.',
  keywords: [
    'machine learning',
    'fire risk',
    'predição',
    'incêndio',
    'INPE',
    'Mossoró',
    'Rio Grande do Norte',
    'queimadas',
  ],
  authors: [{ name: 'Fire Risk ML Project' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml', sizes: '180x180' }],
    shortcut: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: '🔥 Predição de Risco de Fogo | Mossoró/RN',
    description:
      'Sistema de ML para predição de risco de incêndios utilizando Neural Network, KNN e Random Forest.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Fire Risk ML',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🔥 Predição de Risco de Fogo',
    description: 'Sistema de Machine Learning para predição de risco de incêndios',
  },
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="pt-BR" className={fontSans.variable}>
    <body>
      <GlobalProvider>{children}</GlobalProvider>
    </body>
  </html>
);

export default RootLayout;
