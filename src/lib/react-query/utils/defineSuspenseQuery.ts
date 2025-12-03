/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseSuspenseQueryResult } from '@tanstack/react-query';

import {
  DefaultQueryKey,
  SuspenseQueryProps,
  DefaultError,
  DefaultParams,
  SuspenseQueryFactory,
  FetchQueryFactoryCallback,
} from '../types';

export type SuspenseQueryFactoryCallbackFunction<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactoryCallback<
  TParams,
  SuspenseQueryProps<TResponse, TError, TQueryKey>,
  UseSuspenseQueryResult<TResponse, TError>
>;

export const defineSuspenseQuery = <
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
>(
  queryFn: SuspenseQueryFactoryCallbackFunction<TResponse, TParams, TError, TQueryKey>,
): SuspenseQueryFactory<TResponse, TParams, TError, TQueryKey> =>
  ((config: any = {}) => {
    const normalizedConfig = {
      ...config,
      options: config.options || {},
    };

    return queryFn(normalizedConfig);
  }) as SuspenseQueryFactory<TResponse, TParams, TError, TQueryKey>;
