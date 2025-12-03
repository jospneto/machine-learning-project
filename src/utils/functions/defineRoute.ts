/* eslint-disable @typescript-eslint/no-explicit-any */
type DefineRouteCallback<TParams = void> = (params: TParams) => string;

type DefineRouteResult<TParams = void> = TParams extends void
  ? (params?: TParams) => string
  : (params: TParams) => string;

export const defineRoute = <TParams = void>(callback: DefineRouteCallback<TParams>) =>
  ((params: any = {}) => {
    const normalizedParams = { ...params };
    return callback(normalizedParams);
  }) as DefineRouteResult<TParams>;
