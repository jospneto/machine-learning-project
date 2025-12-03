/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */

import { EnvSchema } from '@/lib/env';

// Extend ProcessEnv interface with environment variables schema
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {
      //...
    }
  }
}
