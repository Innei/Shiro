'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { createElement, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import type { NoteModel, PostModel } from '@mx-space/api-client'
import type { FC } from 'react'

import { CommentState } from '@mx-space/api-client'

import { useIsMobile } from '~/atoms/hooks'
import {
  CommentBatchActionGroup,
  CommentDataContext,
  CommentDataSourceContext,
  CommentDesktopTable,
  CommentMobileList,
  CommentSelectionKeysProvider,
  CommentStateContext,
  useSetCommentSelectionKeys,
} from '~/components/modules/dashboard/comments'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { Tabs } from '~/components/ui/tabs'
import { useRouterQueryState } from '~/hooks/biz/use-router-query-state'
import { adminQueries } from '~/queries/definition'

export default function Page() {
  const TABS = useMemo(
    () => [
      {
        key: CommentState.Unread,
        title: '未读',
        component: CommentTable,
        titleComponent: UnreadTabTitle,
      },

      {
        key: CommentState.Read,
        title: '已读',
        component: CommentTable,
      },

      {
        key: CommentState.Junk,
        title: '垃圾',
        component: CommentTable,
      },
    ],
    [],
  )

  const [tab, setTab] = useRouterQueryState('tab', TABS[0].key)

  const currentTab = tab.toString() || TABS[0].key.toString()
  return (
    <div className="relative -mt-12 flex w-full flex-grow flex-col">
      <CommentSelectionKeysProvider>
        <Tabs.Root
          value={currentTab}
          className={clsx(
            'sticky top-16 z-[1] -ml-4 -mt-8 w-[calc(100%+2rem)] px-4 pt-2 lg:pt-4',
            'bg-white/80 backdrop-blur dark:bg-zinc-900/80',
          )}
          onValueChange={(tab) => {
            setTab(tab as any)
          }}
        >
          <Tabs.List id="comment-tabs" className="gap-3">
            {TABS.map(({ title, titleComponent, key }) => (
              <Tabs.Trigger
                key={key}
                value={key as any}
                onClick={() => {
                  setTab(key)
                }}
                selected={currentTab === key.toString()}
                // badge={<UnreadBadge count={tab.unreadCount} />}
              >
                {titleComponent ? createElement(titleComponent) : title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
        {TABS.map(({ key, component: Component }) => {
          if (key.toString() === currentTab)
            return <Component key={key} state={key} />
          return null
        })}

        <CommentBatchActionGroup />
      </CommentSelectionKeysProvider>
    </div>
  )
}

const UnreadTabTitle: FC = () => {
  return (
    <span className="inline-block space-x-1 pb-1">
      <span>未读</span>
    </span>
  )
}

const CommentTable = (props: { state: CommentState }) => {
  const setSelectionKeys = useSetCommentSelectionKeys()
  useEffect(() => {
    return () => setSelectionKeys(new Set())
  }, [])

  const { data, isLoading, fetchNextPage, hasNextPage } =
    // @ts-expect-error
    useInfiniteQuery({
      ...adminQueries.comment.byState(props.state),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.pagination.hasNextPage
          ? lastPage.pagination.currentPage + 1
          : undefined,
    })

  const refModelMap = useMemo<Map<string, PostModel | NoteModel>>(() => {
    if (!data) return new Map()
    const map = new Map()
    data.pages.forEach((page) => {
      page.data.forEach((item) => {
        map.set(item.id, item.ref)
      })
    })
    return map
  }, [data])

  const isMobile = useIsMobile()

  return (
    <CommentStateContext.Provider value={props.state}>
      <CommentDataContext.Provider
        value={useMemo(
          () => ({
            refModelMap,
          }),
          [refModelMap],
        )}
      >
        <CommentDataSourceContext.Provider
          value={useMemo(
            () => ({
              isLoading,
              data,
            }),
            [data, isLoading],
          )}
        >
          <div
            className={clsx(
              'flex flex-col',
              isMobile ? 'mx-auto w-full max-w-[600px]' : '',
            )}
          >
            {isMobile ? <CommentMobileList /> : <CommentDesktopTable />}

            {hasNextPage && <LoadMoreIndicator onLoading={fetchNextPage} />}
          </div>
        </CommentDataSourceContext.Provider>
      </CommentDataContext.Provider>
    </CommentStateContext.Provider>
  )
}
