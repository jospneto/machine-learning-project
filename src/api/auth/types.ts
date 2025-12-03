export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
};

export type PostLoginPayload = {
  email: string;
  password: string;
};
export type PostLoginResponse = {
  access_token: string;
  access_token_expires: number;
  refresh_token: string;
  user: UserResponse;
};

export type PostRefreshTokenPayload = {
  refresh_token: string;
};

export type PostRefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  access_token_expires: number;
};
