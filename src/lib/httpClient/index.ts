import ky from 'ky';

import { API_URL } from '@/config';

import { authorizedRequestHook, unauthorizedErrorHook } from './hooks';

const kyConfig = ky.create({
  prefixUrl: API_URL,
  retry: 1,
});

const httpClient = {
  authorized: () =>
    kyConfig.extend({
      hooks: {
        beforeRequest: [authorizedRequestHook],
        beforeError: [unauthorizedErrorHook],
      },
    }),
  unauthorized: () =>
    kyConfig.extend({
      hooks: {
        beforeRequest: [],
        beforeError: [],
      },
    }),
};

export default httpClient;
