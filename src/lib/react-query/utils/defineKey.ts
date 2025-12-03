/* eslint-disable @typescript-eslint/no-explicit-any */
import { HasRequiredProperties } from '../types';

type DefineKeyResult<T> = T extends void ? [string] : [string, T];
type DefineKeyFunctionParams<TParams> =
  | ({ exact?: true } & { [key in keyof TParams]: TParams[key] })
  | ({ exact: false } & { [key in keyof TParams]?: TParams[key] });

type DefineKeyFunctionResultWithoutParams<TParams> = () => DefineKeyResult<TParams>;

type DefineKeyFunctionResultWithParams<TParams> =
  HasRequiredProperties<TParams> extends true
    ? (params: DefineKeyFunctionParams<TParams>) => DefineKeyResult<TParams>
    : (params?: DefineKeyFunctionParams<TParams>) => DefineKeyResult<TParams>;

type DefineKeyFunction<TParams> = TParams extends void
  ? DefineKeyFunctionResultWithoutParams<TParams>
  : DefineKeyFunctionResultWithParams<TParams>;

export const defineKey = <TParams = void>(key: string) =>
  ((params: any = {}) => {
    const normalizedParams = { exact: true, ...params };
    const { exact, ...rest } = normalizedParams;

    if (exact && Object.keys(rest).length > 0) {
      return [key, rest];
    }
    return [key];
  }) as DefineKeyFunction<TParams>;

export const defineQueryKey = defineKey;
export const defineMutationKey = defineKey;
