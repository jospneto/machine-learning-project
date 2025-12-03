import { PAGES } from '@/config';
import { enableProtectedRoute } from '@/lib/flags';

import { NextAuthAuthorizedCallback } from '../types';

export const authorized: NextAuthAuthorizedCallback = async ({ auth, request: { nextUrl } }) => {
  const isLoggedIn = !!auth?.user;
  const isOnPosts = nextUrl.pathname.startsWith(PAGES.POSTS());

  // Feature flag protection for feature-protected routes
  if (nextUrl.pathname.startsWith(PAGES.FEATURE_PROTECTED())) {
    const isEnabledProtectedRoute = await enableProtectedRoute();

    if (!isEnabledProtectedRoute) {
      return Response.redirect(new URL(PAGES.HOME(), nextUrl));
    }
    // If feature is enabled, still check if user is logged in for this protected route
    return isLoggedIn;
  }

  if (isOnPosts) {
    return isLoggedIn;
  } else if (isLoggedIn) {
    return Response.redirect(new URL(PAGES.POSTS(), nextUrl));
  }
  return true;
};
