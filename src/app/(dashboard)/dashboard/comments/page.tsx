'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { createElement, useEffect, useMemo } from 'react'
import type { NoteModel, PostModel } from '@mx-space/api-client'
import type { FC } from 'react'

import { CommentState } from '@mx-space/api-client'

import {
  CommentBatchActionGroup,
  CommentDataContext,
  CommentDataSourceContext,
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

  const currentTab = tab.toString()
  return (
    <div className="relative -mt-12 flex w-full flex-grow flex-col">
      <CommentSelectionKeysProvider>
        {/* <Tabs
          selectedKey={tab}
          onSelectionChange={setTab as any}
          variant="underlined"
        >
          {TABS.map(({ key, title, component: Component, titleComponent }) => (
            <Tab
              value={key}
              title={titleComponent ? createElement(titleComponent) : title}
              key={key}
              className="flex flex-grow flex-col"
            >
              <div className="flex h-0 flex-grow flex-col overflow-auto">
                <Component state={key} />
              </div>
            </Tab>
          ))}
        </Tabs> */}

        <Tabs.Root
          value={currentTab}
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
          if (key.toString() === currentTab) return <Component state={key} />
          return null
        })}

        <CommentBatchActionGroup />
      </CommentSelectionKeysProvider>
    </div>
  )
}

const UnreadTabTitle: FC = () => {
  // const { data } = trpc.comment.unreadCount.useQuery()
  // const t = useI18n()

  return (
    <span className="inline-block space-x-1 pb-1">
      <span>未读</span>

      {/* {!!data && (
        <Chip size="sm" color="primary" className="scale-80">
          {data}
        </Chip>
      )} */}
    </span>
  )
}

const CommentTable = (props: { state: CommentState }) => {
  const setSelectionKeys = useSetCommentSelectionKeys()
  useEffect(() => {
    return () => setSelectionKeys(new Set())
  }, [])

  const [page, setPage] = useRouterQueryState('page', 1)

  // const { data, isLoading } = trpc.comment.list.useQuery(
  //   {
  //     state: props.state,
  //     page,
  //   },
  //   {
  //     keepPreviousData: true,
  //   },
  // )

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
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
          <div className="mx-auto flex w-full max-w-[600px] flex-col">
            {/* {isMobile ? <CommentMobileList /> : <CommentDesktopTable />} */}
            <CommentMobileList />

            {hasNextPage && <LoadMoreIndicator onLoading={fetchNextPage} />}
          </div>
        </CommentDataSourceContext.Provider>
      </CommentDataContext.Provider>
    </CommentStateContext.Provider>
  )
}
