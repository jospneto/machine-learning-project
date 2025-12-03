/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';

import {
  DefaultError,
  DefaultParams,
  DefaultQueryKey,
  InfiniteQueryProps,
  FetchQueryFactoryCallback,
  InfiniteQueryFactory,
  DefaultPageParam,
} from '../types';

export type InfiniteQueryFactoryCallbackFunction<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
  TPageParam = DefaultPageParam,
> = FetchQueryFactoryCallback<
  TParams,
  InfiniteQueryProps<TResponse, TError, TQueryKey, TPageParam>,
  UseInfiniteQueryResult<InfiniteData<TResponse, TPageParam>, TError>
>;

export const defineInfiniteQuery = <
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
  TPageParam = DefaultPageParam,
>(
  callback: InfiniteQueryFactoryCallbackFunction<TResponse, TParams, TError, TQueryKey, TPageParam>,
): InfiniteQueryFactory<TResponse, TParams, TError, TQueryKey, TPageParam> =>
  ((config: any = {}) => {
    const options = { initialPageParam: 0, ...(config?.options || {}) };

    const normalizedConfig = {
      ...config,
      options,
    };

    return callback(normalizedConfig);
  }) as InfiniteQueryFactory<TResponse, TParams, TError, TQueryKey, TPageParam>;
