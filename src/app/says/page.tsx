'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import { m } from 'framer-motion'
import Markdown from 'markdown-to-jsx'
import type { SayModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'

import { useIsMobile } from '~/atoms'
import { Loading } from '~/components/ui/loading'
import { Masonry } from '~/components/ui/masonry'
import { RelativeTime } from '~/components/ui/relative-time'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { LoadMoreIndicator } from '~/components/widgets/shared/LoadMoreIndicator'
import { NothingFound } from '~/components/widgets/shared/NothingFound'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { addAlphaToHSL, getColorScheme, stringToHue } from '~/lib/color'
import { apiClient } from '~/lib/request'

import { sayQueryKey } from './query'

export default function Page() {
  const { fetchNextPage, hasNextPage, data, isLoading } = useInfiniteQuery({
    queryKey: sayQueryKey,
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.say.getAllPaginated(pageParam)
      return data
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  })

  const isMobile = useIsMobile()

  if (isLoading) {
    return <Loading useDefaultLoadingText />
  }

  if (!data || data.pages.length === 0) return <NothingFound />

  const list = data.pages
    .map((page) => page.data)
    .flat()
    .map((say) => {
      return {
        text: say.text,
        item: say,
        id: say.id,
      }
    })

  return (
    <div>
      <header className="prose">
        <h1>一言</h1>
      </header>

      <main className="mt-10">
        <Masonry Component={Item} columns={isMobile ? 1 : 2} list={list} />

        {hasNextPage && (
          <LoadMoreIndicator onLoading={fetchNextPage} className="mt-12">
            <BottomToUpSoftScaleTransitionView>
              <Masonry
                Component={SaySkeleton}
                columns={isMobile ? 1 : 2}
                list={placeholderData}
              />
            </BottomToUpSoftScaleTransitionView>
          </LoadMoreIndicator>
        )}
      </main>
    </div>
  )
}
const placeholderData = Array.from({ length: 10 }).map((_, index) => ({
  index,
  text: '',
  id: index.toFixed(),
  item: {} as SayModel,
}))
const SaySkeleton = memo(() => {
  return (
    <div className="relative mb-4 border-l-[3px] border-l-slate-500 bg-slate-200/50 px-4 py-3 dark:bg-neutral-800">
      <div className="mb-2 h-6 w-full rounded bg-slate-300/80 dark:bg-neutral-700" />
      <div className="flex text-sm text-base-content/60 md:justify-between">
        <div className="mb-2 h-4 w-14 rounded bg-slate-300/80 dark:bg-neutral-700 md:mb-0" />
        <div className="ml-auto text-right">
          <div className="h-4 w-1/4 rounded bg-slate-300/80 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  )
})
SaySkeleton.displayName = 'SaySkeleton'

const options = {
  disableParsingRawHTML: true,
  forceBlock: true,
} satisfies MarkdownToJSX.Options

const Item = memo<{
  item: SayModel
  index: number
}>(({ item: say, index: i }) => {
  const hasSource = !!say.source
  const hasAuthor = !!say.author
  // const color = colorsMap.get(say.id)
  const { dark: darkColors, light: lightColors } = useMemo(
    () => getColorScheme(stringToHue(say.id)),
    [say.id],
  )
  const isDark = useIsDark()

  return (
    <BottomToUpTransitionView delay={i * 50} key={say.id}>
      <m.blockquote
        layout
        key={say.id}
        className="mb-4 border-l-[3px] px-4 py-3"
        style={{
          borderLeftColor: isDark ? darkColors.accent : lightColors.accent,
          backgroundColor: addAlphaToHSL(
            isDark ? darkColors.background : lightColors.background,
            0.15,
          ),
        }}
      >
        <Markdown className="mb-2" options={options}>{`${say.text}`}</Markdown>
        <div className="flex flex-wrap text-sm text-base-content/60 md:justify-between">
          <div className="mb-2 w-full md:mb-0 md:w-auto">
            <span className="mr-2">发布于</span>
            <RelativeTime date={say.created} />
          </div>
          <div className="w-full text-right md:ml-auto md:w-auto">
            <div>
              {hasSource && `出自“${say.source}”`}
              {hasSource && hasAuthor && ', '}
              {hasAuthor && `作者：${say.author}`}
              {!hasAuthor && !hasSource && '站长说'}
            </div>
          </div>
        </div>
      </m.blockquote>
    </BottomToUpTransitionView>
  )
})
Item.displayName = 'Item'
