'use client'

import type { RecentlyModel } from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { produce } from 'immer'
import { stagger, useAnimate } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { MotionButtonBase } from '~/components/ui/button'
import { Loading } from '~/components/ui/loading'
import { usePrevious } from '~/hooks/common/use-previous'
import { preventDefault } from '~/lib/dom'
import { apiClient } from '~/lib/request'

import { FETCH_SIZE, QUERY_KEY } from './constants'
import { ThinkingItem } from './item'

export default function Page() {
  const t = useTranslations('thinking')
  return (
    <div>
      <header className="prose">
        <h1 className="flex items-end gap-2">
          {t('page_title')}
          <a
            data-event="Say RSS click"
            aria-hidden
            href="/thinking/feed"
            target="_blank"
            className="center flex size-8 select-none text-[#EE802F]"
            rel="noreferrer"
          >
            <i className="i-mingcute-rss-fill" />
          </a>
        </h1>
        <h3>{t('page_subtitle')}</h3>
      </header>
      <main className="-mt-12">
        <PostBox />
        <List />
      </main>
    </div>
  )
}

const PostBox = () => {
  const t = useTranslations('thinking')
  const isLogin = useIsOwnerLogged()

  const [value, setValue] = useState('')
  const queryClient = useQueryClient()
  const { mutateAsync: handleSend, isPending } = useMutation({
    mutationFn: async () => {
      apiClient.shorthand.proxy
        .post({ data: { content: value } })
        .then((res) => {
          setValue('')

          queryClient.setQueryData<
            InfiniteData<
              RecentlyModel[] & {
                comments: number
              }
            >
          >(QUERY_KEY, (old) =>
            produce(old, (draft) => {
              draft?.pages[0].unshift(res.$serialized as any)
              return draft
            }),
          )
        })
    },
  })
  if (!isLogin) return null

  return (
    <form onSubmit={preventDefault} className="mb-8">
      <div className="relative h-[150px] bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={t('post_placeholder')}
          className="size-full resize-none bg-transparent p-3 text-sm outline-none"
        />
        <div className="center absolute bottom-2 right-2 flex size-5">
          <MotionButtonBase
            onClick={() => handleSend()}
            disabled={value.length === 0 || isPending}
            className="duration-200 disabled:cursor-not-allowed disabled:opacity-10"
          >
            <TiltedSendIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            <span className="sr-only">{t('send')}</span>
          </MotionButtonBase>
        </div>
      </div>
    </form>
  )
}

const List = () => {
  const [hasNext, setHasNext] = useState(true)

  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.shorthand.getList({
        before: pageParam,
        size: FETCH_SIZE,
      })

      if (data.length < FETCH_SIZE) {
        setHasNext(false)
      }
      return data
    },
    enabled: hasNext,
    refetchOnMount: true,

    getNextPageParam: (l) => (l.length > 0 ? l.at(-1)?.id : undefined),
    initialPageParam: undefined as undefined | string,
  })

  const [scope, animate] = useAnimate()

  const getPrevData = usePrevious(data)
  useEffect(() => {
    if (!data) return
    const pages = getPrevData()?.pages
    const count = pages?.reduce((acc, cur) => acc + cur.length, 0)

    animate(
      'li',
      {
        opacity: 1,
        y: 0,
      },
      {
        duration: 0.2,
        delay: stagger(0.1, {
          startDelay: 0.15,
          from: count ? count - FETCH_SIZE : 0,
        }),
      },
    )
  }, [data])

  if (isLoading) <Loading useDefaultLoadingText />

  return (
    <ul ref={scope}>
      {data?.pages.map((page) =>
        page.map((item) => <ThinkingItem item={item} key={item.id} />),
      )}

      {hasNext && (
        <LoadMoreIndicator
          onLoading={() => {
            fetchNextPage()
          }}
        />
      )}
    </ul>
  )
}
