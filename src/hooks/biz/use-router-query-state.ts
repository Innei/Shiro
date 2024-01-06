import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type LiteralToBroad<T> = T extends number
  ? number
  : T extends string
    ? string
    : T extends boolean
      ? boolean
      : T // Default case
export const useRouterQueryState = <T extends string | number>(
  queryKey: string,
  fallbackState: LiteralToBroad<T>,
) => {
  const [state, setState] = useState<LiteralToBroad<T>>(fallbackState)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const stateFromQuery = searchParams.get(queryKey)
  useEffect(() => {
    setState(stateFromQuery as LiteralToBroad<T>)
  }, [stateFromQuery])

  return [
    state ?? fallbackState,
    useCallback(
      (state: LiteralToBroad<T>) => {
        // setSearchParams((prev) => {
        //   prev.set(queryKey, String(state))
        //   return new URLSearchParams(prev)
        // })

        router.replace(`${pathname}?${queryKey}=${state}`)
      },
      [pathname, queryKey, router],
    ),
  ] as const
}
