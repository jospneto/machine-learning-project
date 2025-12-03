/* eslint-disable @typescript-eslint/ban-types */
import {
  UseSuspenseQueryResult,
  UseSuspenseQueryOptions,
  UseInfiniteQueryResult,
  UseInfiniteQueryOptions,
  InfiniteData,
  UseQueryResult,
  UseQueryOptions,
  FetchQueryOptions,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { HTTPError } from 'ky';

// Default Types
export type DefaultParams = void;
export type DefaultPayload = void;
export type DefaultError = HTTPError;
export type DefaultQueryKey = unknown[];
export type DefaultContext = unknown;
export type DefaultPageParam = number;

// Utilities Types
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type HasRequiredProperties<T> = RequiredKeys<T> extends never ? false : true;

// TanStack Factory
export type FetchQueryFactory<
  TParams = DefaultParams,
  TOptions = unknown,
  TResult = unknown,
> = TParams extends void
  ? (config?: { options?: TOptions }) => TResult
  : HasRequiredProperties<TParams> extends true
    ? (config: { params: TParams; options?: TOptions }) => TResult
    : (config?: { params?: TParams; options?: TOptions }) => TResult;

export type FetchQueryFactoryCallback<
  TParams = DefaultParams,
  TOptions = unknown,
  TResult = unknown,
> = TParams extends void
  ? (config: { options: TOptions }) => TResult
  : (config: { params: TParams; options: TOptions }) => TResult;

// Query
export type QueryProps<
  TResponse,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = Omit<UseQueryOptions<TResponse, TError, TResponse, TQueryKey>, 'queryKey' | 'queryFn'>;

export type QueryFactory<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactory<
  TParams,
  QueryProps<TResponse, TError, TQueryKey>,
  UseQueryResult<TResponse, TError>
>;

// Infinite Query
export type InfiniteQueryProps<
  TResponse,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
  TPageParam = DefaultPageParam,
> = Omit<
  UseInfiniteQueryOptions<
    TResponse,
    TError,
    InfiniteData<TResponse, TPageParam>,
    TQueryKey,
    TPageParam
  >,
  'queryKey' | 'queryFn'
>;

export type InfiniteQueryFactory<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
  TPageParam = DefaultPageParam,
> = FetchQueryFactory<
  TParams,
  InfiniteQueryProps<TResponse, TError, TQueryKey, TPageParam>,
  UseInfiniteQueryResult<InfiniteData<TResponse, TPageParam>, TError>
>;

// Suspense Query
export type SuspenseQueryProps<
  TResponse,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = Omit<UseSuspenseQueryOptions<TResponse, TError, TResponse, TQueryKey>, 'queryKey' | 'queryFn'>;

export type SuspenseQueryFactory<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactory<
  TParams,
  SuspenseQueryProps<TResponse, TError, TQueryKey>,
  UseSuspenseQueryResult<TResponse, TError>
>;

// Prefetch Query
export type PrefetchQueryProps<
  TResponse,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = Omit<FetchQueryOptions<TResponse, TError, TResponse, TQueryKey>, 'queryKey' | 'queryFn'>;

export type PrefetchQueryFactory<
  TResponse,
  TParams = DefaultParams,
  TError = DefaultError,
  TQueryKey extends DefaultQueryKey = DefaultQueryKey,
> = FetchQueryFactory<TParams, PrefetchQueryProps<TResponse, TError, TQueryKey>, void>;

export type MutationProps<
  TResponse,
  TPayload = DefaultPayload,
  TError = DefaultError,
  TContext = DefaultContext,
> = Omit<UseMutationOptions<TResponse, TError, TPayload, TContext>, 'mutationKey' | 'mutationFn'>;

export type MutationFactory<
  TResponse,
  TPayload = DefaultPayload,
  TError = DefaultError,
  TContext = DefaultContext,
> = (config?: {
  options?: MutationProps<TResponse, TPayload, TError, TContext>;
}) => UseMutationResult<TResponse, TError, TPayload, TContext>;
