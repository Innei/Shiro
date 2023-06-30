import type { FetchQueryOptions, QueryKey } from '@tanstack/react-query'

export const defineQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): Omit<
  FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  'queryKey'
> & { queryKey: string[] } => {
  return options as any
}
