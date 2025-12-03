import NextAuth, { NextAuthConfig } from 'next-auth';

import { AUTH_SECRET, AUTH_TRUST_HOST } from '@/config';

import { callbacks } from './callbacks';
import { providers } from './providers';

export const authConfig = {
  providers,
  secret: AUTH_SECRET,
  trustHost: AUTH_TRUST_HOST,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks,
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
