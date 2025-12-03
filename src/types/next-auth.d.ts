import { User } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    access_token: string;
    refresh_token: string;
    access_token_expires: number;
    role: 'admin' | 'user';
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: User;
  }
}
