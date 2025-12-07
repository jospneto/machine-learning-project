import { PAGES } from '@/config';
import { enableProtectedRoute } from '@/lib/flags';

import { NextAuthAuthorizedCallback } from '../types';

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ['/', '/fire-risk', '/login', '/api'];

export const authorized: NextAuthAuthorizedCallback = ({ auth, request: { nextUrl } }) => {
  const isLoggedIn = !!auth?.user;
  const pathname = nextUrl.pathname;

  // Permitir todas as rotas públicas
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isPublicRoute) {
    return true;
  }

  // Feature flag protection for feature-protected routes
  if (pathname.startsWith(PAGES.FEATURE_PROTECTED())) {
    if (!enableProtectedRoute) {
      return Response.redirect(new URL(PAGES.HOME(), nextUrl));
    }
    return isLoggedIn;
  }

  // Rotas protegidas requerem login
  if (pathname.startsWith(PAGES.POSTS())) {
    return isLoggedIn;
  }

  // Por padrão, permitir acesso
  return true;
};
