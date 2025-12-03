import { NextAuthCallbacks } from '../types';

import { authorized } from './authorized';
import { jwt } from './jwt';
import { session } from './session';

export const callbacks = {
  jwt,
  session,
  authorized,
} satisfies NextAuthCallbacks;
