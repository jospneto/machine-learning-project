import { AdapterUser } from 'next-auth/adapters';

import { NextAuthSessionCallback } from '../types';

export const session: NextAuthSessionCallback = ({ session, token }) => {
  if (token?.user) {
    session.user = token.user as AdapterUser;
  }
  return session;
};
