import { notFound } from 'next/navigation';

import { enableProtectedRoute } from '@/lib/flags';
import { LayoutProps } from '@/types';

const Layout = async ({ children }: LayoutProps) => {
  const isAvailable = await enableProtectedRoute();

  if (!isAvailable) return notFound();

  return children;
};

export default Layout;
