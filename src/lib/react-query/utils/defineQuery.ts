/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultError, UseQueryResult } from '@tanstack/react-query';

import {
  DefaultParams,
  DefaultQueryKey,
  QueryFactory,
  QueryProps,
  FetchQueryFactoryCallback,
} from '../types';

export type QueryFactoryCallbackFunction<
  TResponse,
  TParams = void,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactoryCallback<
  TParams,
  QueryProps<TResponse, TError, TQueryKey>,
  UseQueryResult<TResponse, TError>
>;

export const defineQuery = <
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
>(
  callback: QueryFactoryCallbackFunction<TResponse, TParams, TError, TQueryKey>,
): QueryFactory<TResponse, TParams, TError, TQueryKey> =>
  ((config: any = {}) => {
    const normalizedConfig = {
      ...config,
      params: config.params || {},
      options: config.options || {},
    };

    return callback(normalizedConfig);
  }) as QueryFactory<TResponse, TParams, TError, TQueryKey>;
