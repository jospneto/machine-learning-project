import { BeforeErrorHook } from 'ky';

import { removeSession } from '@/lib/auth';
import { HttpErrorCodes } from '@/types';

export const unauthorizedErrorHook: BeforeErrorHook = async (error) => {
  if (error?.response?.status === HttpErrorCodes.UNAUTHORIZED) {
    await removeSession();
  }

  return error;
};
