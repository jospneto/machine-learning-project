/* eslint-disable @typescript-eslint/no-explicit-any */
type WithSearchParams<T = void> = T extends void
  ? { searchParams?: URLSearchParams }
  : T & { searchParams?: URLSearchParams };

type DefinePageCallback<TParams = void> = (params: WithSearchParams<TParams>) => string;

type DefinePageResult<TParams = void> = TParams extends void
  ? (params?: WithSearchParams<TParams>) => string
  : (params: WithSearchParams<TParams>) => string;

export const definePage = <TParams = void>(callback: DefinePageCallback<TParams>) =>
  ((params: any = {}) => {
    const normalizedParams = { ...params };
    const searchParams = normalizedParams?.searchParams as URLSearchParams;
    const result = callback(normalizedParams);
    return searchParams instanceof URLSearchParams
      ? `${result}?${searchParams?.toString()}`
      : result;
  }) as DefinePageResult<TParams>;
