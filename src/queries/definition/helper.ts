import type { FetchQueryOptions, QueryKey } from '@tanstack/react-query'

export const defineQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  return options
}
