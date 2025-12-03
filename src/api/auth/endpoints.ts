import httpClient from '@/lib/httpClient';

import {
  PostLoginPayload,
  PostLoginResponse,
  PostRefreshTokenPayload,
  PostRefreshTokenResponse,
} from './types';

export const postLogin = async ({
  email,
  password,
}: PostLoginPayload): Promise<PostLoginResponse> => {
  const response = await httpClient.unauthorized().post<PostLoginResponse>('/auth/login', {
    json: {
      email,
      password,
    },
  });
  const data = await response.json();

  return data;
};

export const postRefreshToken = async ({
  refresh_token,
}: PostRefreshTokenPayload): Promise<PostRefreshTokenResponse> => {
  const response = await httpClient
    .unauthorized()
    .post<PostRefreshTokenResponse>('/auth/refresh-token', {
      json: {
        refresh_token,
      },
    });
  const data = await response.json();

  return data;
};
