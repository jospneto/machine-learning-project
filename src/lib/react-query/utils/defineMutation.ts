/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutationResult } from '@tanstack/react-query';

import {
  DefaultContext,
  DefaultError,
  DefaultPayload,
  MutationFactory,
  MutationProps,
} from '../types';

export type MutationFactoryCallbackFunction<
  TResponse,
  TPayload = DefaultPayload,
  TError = DefaultError,
  TContext = DefaultContext,
> = (config: {
  options: MutationProps<TResponse, TPayload, TError, TContext>;
}) => UseMutationResult<TResponse, TError, TPayload, TContext>;

export const defineMutation = <
  TResponse,
  TPayload = DefaultPayload,
  TError = DefaultError,
  TContext = DefaultContext,
>(
  callback: MutationFactoryCallbackFunction<TResponse, TPayload, TError, TContext>,
): MutationFactory<TResponse, TPayload, TError, TContext> =>
  ((config: any = {}) => {
    const normalizedConfig = {
      ...config,
      params: config.params || {},
      options: config.options || {},
    };

    return callback(normalizedConfig);
  }) as MutationFactory<TResponse, TPayload, TError, TContext>;
