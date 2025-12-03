import { BeforeRequestHook } from 'ky';

import { getSession } from '@/lib/auth';

export const authorizedRequestHook: BeforeRequestHook = async (request) => {
  const session = await getSession();

  request.headers.set('Authorization', `Bearer ${session?.user?.access_token}`);

  return request;
};
