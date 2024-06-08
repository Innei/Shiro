'use client'

import { useCallback } from 'react'
import clsx from 'clsx'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import type { PostsParams } from '~/lib/route-builder'

import { FABPortable } from '~/components/ui/fab'
import { FloatPanel } from '~/components/ui/float-panel/FloatPanel'
import { Select } from '~/components/ui/select'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useRefValue } from '~/hooks/common/use-ref-value'
import { useSetSearchParams } from '~/hooks/common/use-set-search-params'
import { Noop } from '~/lib/noop'
import { routeBuilder, Routes } from '~/lib/route-builder'

import { postsViewModeAtom, usePostViewMode } from '../atom'

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

const SortingAndOrdering = () => {
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
    <>
      <section>
        <div className="ml-1 font-bold">按...排序</div>
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
        <div className="ml-1 font-bold">顺序</div>
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
    </>
  )
}

export const PostsSettingFab = () => {
  const setViewMode = useSetAtom(postsViewModeAtom)
  const viewMode = usePostViewMode()
  const setParams = useSetSearchParams()

  useIsomorphicLayoutEffect(() => {
    setParams('view_mode', viewMode)
  }, [viewMode])

  return (
    <FloatPanel
      placement="left-end"
      triggerElement={
        <FABPortable onClick={Noop}>
          <i className="icon-[mingcute--settings-5-line]" />
        </FABPortable>
      }
    >
      <main className="relative flex w-[300px] flex-col">
        <SortingAndOrdering />
        <section className="mb-2 mt-4">
          <div className="ml-1 font-bold">列表模式</div>

          <div className="mt-4 grid w-full grid-cols-2 gap-2 px-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="compact"
                name="radio-4"
                onChange={(e) => {
                  if (e.target.checked) setViewMode('compact')
                }}
                className="radio-accent radio radio-xs"
                checked={viewMode === 'compact'}
              />

              <label htmlFor="compact">紧凑模式</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={viewMode}
                type="radio"
                name="radio-4"
                className="radio-accent radio radio-xs"
                checked={viewMode === 'loose'}
                id="loose"
                onChange={(e) => {
                  if (e.target.checked) setViewMode('loose')
                }}
              />

              <label htmlFor="loose">预览模式</label>
            </div>
          </div>
        </section>
      </main>
    </FloatPanel>
  )
}
