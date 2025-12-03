/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DefaultError,
  DefaultParams,
  DefaultQueryKey,
  FetchQueryFactoryCallback,
  PrefetchQueryFactory,
  PrefetchQueryProps,
} from '../types';

export type PrefetchQueryFactoryCallbackFunction<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactoryCallback<TParams, PrefetchQueryProps<TResponse, TError, TQueryKey>, void>;

export const definePrefetchQuery = <
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
>(
  callback: PrefetchQueryFactoryCallbackFunction<TResponse, TParams, TError, TQueryKey>,
): PrefetchQueryFactory<TResponse, TParams, TError, TQueryKey> =>
  ((config: any = {}) => {
    const normalizedConfig = {
      ...config,
      options: config.options || {},
    };

    return callback(normalizedConfig);
  }) as PrefetchQueryFactory<TResponse, TParams, TError, TQueryKey>;
