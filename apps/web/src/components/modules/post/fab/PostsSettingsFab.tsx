'use client'

import clsx from 'clsx'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { FloatPanel } from '~/components/ui/float-panel/FloatPanel'
import { Select } from '~/components/ui/select'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useSetSearchParams } from '~/hooks/common/use-set-search-params'
import { useRouter } from '~/i18n/navigation'
import { Noop } from '~/lib/noop'
import type { PostsParams } from '~/lib/route-builder'
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
  const t = useTranslations('common')
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [orderBy, setOrderBy] = useAtom(orderByAtom)

  const sortByValues = [
    {
      label: t('sort_default'),
      value: 'default',
    },
    {
      label: t('sort_created'),
      value: 'created',
    },
    {
      label: t('sort_modified'),
      value: 'modified',
    },
  ] as SortByValues

  const orderByValues = [
    {
      label: t('order_desc'),
      value: 'desc',
    },
    {
      label: t('order_asc'),
      value: 'asc',
    },
  ] as OrderByValues
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
        <div className="ml-1 font-bold">{t('sort_by')}</div>
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
        <div className="ml-1 font-bold">{t('order_label')}</div>
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
  const t = useTranslations('common')
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
          <i className="i-mingcute-settings-5-line" />
        </FABPortable>
      }
    >
      <main className="relative flex w-[300px] flex-col">
        <SortingAndOrdering />
        <section className="mb-2 mt-4">
          <div className="ml-1 font-bold">{t('view_mode')}</div>

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

              <label htmlFor="compact">{t('view_compact')}</label>
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

              <label htmlFor="loose">{t('view_preview')}</label>
            </div>
          </div>
        </section>
      </main>
    </FloatPanel>
  )
}
