/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'

import { ClientOnly } from '~/components/common/ClientOnly'
import { PageDataHolder } from '~/components/common/PageHolder'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/internal/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { NoteFooterNavigationBarForMobile } from '~/components/widgets/note/NoteFooterNavigation'
import { NoteTopic } from '~/components/widgets/note/NoteTopic'
import { TocAside, TocAutoScroll } from '~/components/widgets/toc'
import { XLogInfoForNote, XLogSummaryForNote } from '~/components/widgets/xlog'
import { useNoteByNidQuery, useNoteData } from '~/hooks/data/use-note'
import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { MarkdownImageRecordProvider } from '~/providers/article/markdown-image-record-provider'
import {
  CurrentNoteIdProvider,
  useSetCurrentNoteId,
} from '~/providers/note/current-note-id-provider'
import { NoteLayoutRightSidePortal } from '~/providers/note/right-side-provider'
import { parseDate } from '~/utils/datetime'
import { springScrollToTop } from '~/utils/scroller'

import { NoteActionAside } from '../../../components/widgets/note/NoteActionAside'
import { NoteHideIfSecret } from '../../../components/widgets/note/NoteHideIfSecret'
import { NoteMetaBar } from '../../../components/widgets/note/NoteMetaBar'
import styles from './page.module.css'

const noopArr = [] as Image[]

const PageImpl = () => {
  const { id } = useParams() as { id: string }
  const { data } = useNoteByNidQuery(id)

  // Why do this, I mean why do set NoteId to context, don't use `useParams().id` for children components.
  // Because any router params or query changes, will cause components that use `useParams()` hook, this hook is a context hook,
  // For example, `ComA` use `useParams()` just want to get value `id`,
  // but if router params or query changes `page` params, will cause `CompA` re - render.
  const setNoteId = useSetCurrentNoteId()
  useEffect(() => {
    setNoteId(id)
  }, [id])

  const note = data?.data
  const setHeaderMetaInfo = useSetHeaderMetaInfo()
  useEffect(() => {
    if (!note?.title) return
    setHeaderMetaInfo({
      title: note?.title,
      description: `手记${note.topic?.name ? ` / ${note.topic?.name}` : ''}`,
      slug: note?.nid.toString(),
    })
  }, [note?.nid, note?.title, note?.topic?.name])

  if (!note) {
    return <Loading useDefaultLoadingText />
  }

  const tips = `创建于 ${parseDate(note.created, 'YYYY 年 M 月 D 日 dddd')}${
    note.modified
      ? `，修改于 ${parseDate(note.modified, 'YYYY 年 M 月 D 日 dddd')}`
      : ''
  }`

  return (
    <CurrentNoteIdProvider initialNoteId={id}>
      <article
        className={clsx('prose', styles['with-indent'], styles['with-serif'])}
      >
        <header>
          <NoteTitle />
          <span className="inline-flex items-center text-[13px] text-neutral-content/60">
            <FloatPopover TriggerComponent={NoteDateMeta}>{tips}</FloatPopover>

            <ClientOnly>
              <NoteMetaBar />
            </ClientOnly>
          </span>
        </header>

        <NoteHideIfSecret>
          <XLogSummaryForNote />
          <ArticleElementProvider>
            <MarkdownImageRecordProvider images={note.images || noopArr}>
              <Markdown
                as="main"
                renderers={MarkdownRenderers}
                value={note.text}
              />
            </MarkdownImageRecordProvider>

            <NoteLayoutRightSidePortal>
              <TocAside
                className="sticky top-[120px] ml-4 mt-[120px]"
                treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
              >
                <NoteActionAside className="translate-y-full" />
              </TocAside>
              <TocAutoScroll />
            </NoteLayoutRightSidePortal>
          </ArticleElementProvider>
        </NoteHideIfSecret>
      </article>

      <NoteTopic topic={note.topic} />
      <XLogInfoForNote />
      <NoteFooterNavigationBarForMobile id={id} />
    </CurrentNoteIdProvider>
  )
}

const NoteTitle = () => {
  const note = useNoteData()
  if (!note) return null
  const title = note.title
  return (
    <h1 className="mt-8 text-left font-bold text-base-content/95">
      <Balancer>{title}</Balancer>
    </h1>
  )
}

const NoteDateMeta = () => {
  const note = useNoteData()
  if (!note) return null

  const dateFormat = dayjs(note.created)
    .locale('zh-cn')
    .format('YYYY 年 M 月 D 日 dddd')

  return (
    <span className="inline-flex items-center space-x-1">
      <MdiClockOutline />
      <time className="font-medium" suppressHydrationWarning>
        {dateFormat}
      </time>
    </span>
  )
}

const MarkdownRenderers: { [name: string]: Partial<MarkdownToJSX.Rule> } = {
  text: {
    react(node, _, state) {
      return (
        <span className="indent" key={state?.key}>
          {node.content}
        </span>
      )
    },
  },
}

export default PageDataHolder(PageImpl, () => {
  const { id } = useParams() as { id: string }

  useEffect(() => {
    springScrollToTop()
  }, [id])
  return useNoteByNidQuery(id)
})
