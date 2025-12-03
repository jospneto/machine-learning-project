export type DefineEndpointCallback<TResponse = void, TParameters = void> = (
  parameters: TParameters,
) => Promise<TResponse>;

export const defineEndpoint = <TResponse = void, TParameters = void>(
  callback: DefineEndpointCallback<TResponse, TParameters>,
) => callback;
