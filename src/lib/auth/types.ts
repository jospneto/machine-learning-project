import { NextAuthConfig } from 'next-auth';

export type NextAuthCallbacks = NonNullable<NextAuthConfig['callbacks']>;

export type NextAuthJWTCallback = NextAuthCallbacks['jwt'];
export type NextAuthSessionCallback = NextAuthCallbacks['session'];
export type NextAuthSignInCallback = NextAuthCallbacks['signIn'];
export type NextAuthAuthorizedCallback = NextAuthCallbacks['authorized'];
export type NextAuthRedirectCallback = NextAuthCallbacks['redirect'];
