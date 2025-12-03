import { postRefreshToken } from '@/api/auth/endpoints';

import { NextAuthJWTCallback } from '../types';

export const jwt: NextAuthJWTCallback = async ({ token, user }) => {
  const expires = new Date(token?.user?.access_token_expires * 1000).getTime();

  if (expires && Date.now() < expires) return token;

  if (user) {
    token.user = user;
    return token;
  }

  if (!token?.user?.refresh_token) throw new Error('Refresh token not found');

  try {
    const response = await postRefreshToken({ refresh_token: token?.user?.refresh_token });

    token.user.access_token = response.access_token;
    token.user.refresh_token = response.refresh_token;
    token.user.access_token_expires = response.access_token_expires;

    return token;
  } catch (error) {
    console.error('Error refreshing access_token', error);
    token.error = 'RefreshTokenError';
    return token;
  }
};
