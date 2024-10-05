'use client'

import clsx from 'clsx'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { FloatPanel } from '~/components/ui/float-panel/FloatPanel'
import { Select } from '~/components/ui/select'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { Noop } from '~/lib/noop'
import type { PostsParams } from '~/lib/route-builder'
import { routeBuilder, Routes } from '~/lib/route-builder'

type SortBy = 'default' | 'created' | 'modified'
type OrderBy = 'asc' | 'desc'

type SortByValues = {
  label: string
  value: SortBy
}[]

type OrderByValues = {
  label: string
  value: OrderBy
}[]

const sortByAtom = atom<SortBy>('default')
const orderByAtom = atom<OrderBy>('desc')

export const PostsSortingFab = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [orderBy, setOrderBy] = useAtom(orderByAtom)

  const sortByValues = useRefValue(
    () =>
      [
        {
          label: '默认',
          value: 'default',
        },
        {
          label: '创建时间',
          value: 'created',
        },
        {
          label: '更新时间',
          value: 'modified',
        },
      ] as SortByValues,
  )

  const orderByValues = useRefValue(
    () =>
      [
        {
          label: '降序',
          value: 'desc',
        },
        {
          label: '升序',
          value: 'asc',
        },
      ] as OrderByValues,
  )
  const router = useRouter()
  const handleChange = useEventCallback(() => {
    const params = {} as PostsParams
    if (sortBy === 'default') {
      router.push(routeBuilder(Routes.Posts, {}))
      return
    }
    if (orderBy) params.orderBy = orderBy

    if (sortBy) params.sortBy = sortBy

    router.replace(routeBuilder(Routes.Posts, params))
  })

  return (
    <FloatPanel
      placement="left-end"
      triggerElement={useMemo(
        () => (
          <FABPortable onClick={Noop}>
            <i className="i-mingcute-sort-descending-line" />
          </FABPortable>
        ),
        [],
      )}
    >
      <main className="relative flex w-[300px] flex-col">
        <section>
          <div className="ml-1">按...排序</div>
          <Select<SortBy>
            className="mt-2"
            values={sortByValues}
            value={sortBy}
            onChange={useCallback((val) => {
              setSortBy(val)

              requestAnimationFrame(() => {
                handleChange()
              })
            }, [])}
          />
        </section>

        <section className="mb-2 mt-4">
          <div className="ml-1">顺序</div>
          <Select<OrderBy>
            className={clsx(
              'mt-2',
              sortBy === 'default' && 'pointer-events-none opacity-50',
            )}
            values={orderByValues}
            value={orderBy}
            onChange={useCallback((val) => {
              setOrderBy(val)
              requestAnimationFrame(() => {
                handleChange()
              })
            }, [])}
          />
        </section>
      </main>
    </FloatPanel>
  )
}
