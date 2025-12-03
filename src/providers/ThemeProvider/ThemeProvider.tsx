'use client';

import dynamic from 'next/dynamic';
import { type ThemeProviderProps } from 'next-themes';

const NextThemesProvider = dynamic(
  async () => {
    const themes = await import('next-themes');
    return themes.ThemeProvider;
  },
  {
    ssr: false,
  },
);

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>{children}</NextThemesProvider>
);
