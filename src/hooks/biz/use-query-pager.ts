import { createContext, createElement, useContext, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { PrimitiveAtom } from 'jotai'
import type { FC } from 'react'

import { useBeforeMounted } from '../common/use-before-mounted'

const ctx = createContext<{
  pageAtom: PrimitiveAtom<number>
  sizeAtom: PrimitiveAtom<number>
}>(null!)

export const useQueryPager = () => {
  const pCtx = useContext(ctx)
  if (!pCtx) throw new Error('useQueryPager must be used in QueryPagerProvider')
  const { pageAtom, sizeAtom } = pCtx
  const [page, setPage] = useAtom(pageAtom)
  const [size, setSize] = useAtom(sizeAtom)

  const search = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useBeforeMounted(() => {
    const nextSearch = new URLSearchParams(search)
    if (!search.get('page')) {
      nextSearch.set('page', String(page))
    }
    if (!search.get('size')) {
      nextSearch.set('size', String(size))
    }
    if (nextSearch.toString() !== search.toString())
      router.replace(`${pathname}?${nextSearch.toString()}`)
    try {
      search.forEach((value, key) => {
        if (key === 'page') {
          setPage(Number(value))
        }
        if (key === 'size') {
          setSize(Number(value))
        }
      })
    } catch {}
  })

  useEffect(() => {
    router.replace(`${pathname}?page=${page}&size=${size}`)
  }, [page, size])

  return [page, size, setPage, setSize] as const
}

export const withQueryPager = <T extends {}>(Component: FC<T>): FC<T> => {
  const ctxValue = {
    pageAtom: atom(1),
    sizeAtom: atom(10),
  }
  return function QueryPagerProvider(props) {
    return createElement(
      ctx.Provider,
      {
        value: ctxValue,
      },
      createElement(Component, props),
    )
  }
}
