import { Session } from 'next-auth';
import { getSession as getSessionFromClient, signOut as signOutFromClient } from 'next-auth/react';

import { auth as getSessionFromServer, signOut as signOutFromServer } from '@/lib/auth';
import { isClient } from '@/utils/functions';

let browserSession: Session | null = null;

export const getSession = async () => {
  if (isClient()) {
    if (!browserSession) browserSession = await getSessionFromClient();
    return browserSession;
  }
  return await getSessionFromServer();
};

export const removeSession = async () => {
  if (isClient()) {
    browserSession = null;
    return await signOutFromClient();
  }
  return await signOutFromServer();
};
