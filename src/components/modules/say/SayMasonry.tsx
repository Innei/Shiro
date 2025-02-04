'use client'

import type { SayModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
import { m } from 'motion/react'
import { memo, useMemo } from 'react'
import Masonry from 'react-responsive-masonry'

import { useIsLogged } from '~/atoms/hooks/owner'
import { useIsMobile } from '~/atoms/hooks/viewport'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { RelativeTime } from '~/components/ui/relative-time'
import {
  BottomToUpSoftScaleTransitionView,
  BottomToUpTransitionView,
} from '~/components/ui/transition'
import { useIsDark } from '~/hooks/common/use-is-dark'
import { addAlphaToHSL, getColorScheme, stringToHue } from '~/lib/color'
import { clsxm } from '~/lib/helper'

import { useSayListQuery, useSayModal } from './hooks'

export const SayMasonry = () => {
  const { fetchNextPage, hasNextPage, data } = useSayListQuery()

  const isMobile = useIsMobile()

  if (!data) return null

  const list = data.pages
    .flatMap((page) => page.data)
    .map((say) => ({
      text: say.text,
      item: say,
      id: say.id,
    }))

  return (
    <>
      <Masonry gutter="1rem" columnsCount={isMobile ? 1 : 2}>
        {list.map((item, index) => (
          <Item key={item.id} item={item.item} index={index} />
        ))}
      </Masonry>
      {hasNextPage && (
        <LoadMoreIndicator onLoading={fetchNextPage} className="mt-12">
          <BottomToUpSoftScaleTransitionView>
            <Masonry columnsCount={isMobile ? 1 : 2}>
              {placeholderData.map((item) => (
                <SaySkeleton key={item.id} />
              ))}
            </Masonry>
          </BottomToUpSoftScaleTransitionView>
        </LoadMoreIndicator>
      )}
    </>
  )
}

const placeholderData = Array.from({ length: 10 }).map((_, index) => ({
  index,
  text: '',
  id: index.toFixed(0),
  item: {} as SayModel,
}))
const SaySkeleton = memo(() => (
  <div className="relative border-l-[3px] border-l-slate-500 bg-slate-200/50 px-4 py-3 dark:bg-neutral-800">
    <div className="mb-2 h-6 w-full rounded bg-slate-300/80 dark:bg-neutral-700" />
    <div className="flex text-sm text-base-content/60 md:justify-between">
      <div className="mb-2 h-4 w-14 rounded bg-slate-300/80 dark:bg-neutral-700 md:mb-0" />
      <div className="ml-auto text-right">
        <div className="h-4 w-1/4 rounded bg-slate-300/80 dark:bg-neutral-700" />
      </div>
    </div>
  </div>
))
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

  const isLogged = useIsLogged()
  const present = useSayModal()

  return (
    <BottomToUpTransitionView className="w-full" delay={i * 50} key={say.id}>
      <m.blockquote
        layout
        key={say.id}
        className="group relative border-l-[3px] px-4 py-3"
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
        {isLogged && (
          <button
            onClick={() => present(say)}
            className={clsxm(
              'absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 bg-base-100',
              'center flex size-6 rounded-full text-accent opacity-0 ring-1 ring-slate-200 duration-200 group-hover:opacity-100 dark:ring-neutral-800',
            )}
          >
            <i className="i-mingcute-quill-pen-line" />
            <span className="sr-only">编辑</span>
          </button>
        )}
      </m.blockquote>
    </BottomToUpTransitionView>
  )
})
Item.displayName = 'Item'
