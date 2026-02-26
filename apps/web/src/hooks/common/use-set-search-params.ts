import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import { usePathname, useRouter } from '~/i18n/navigation'

// https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
export const useSetSearchParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams],
  )

  return useCallback(
    (name: string, value: string) => {
      const queryString = createQueryString(name, value)
      router.replace(`${pathname}?${queryString}`, { scroll: false })
    },
    [createQueryString, pathname, router],
  )
}
