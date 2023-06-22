/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { memo, Suspense, useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import type { Image, NoteModel } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'

import { BanCopyWrapper } from '~/components/common/BanCopyWrapper'
import { ClientOnly } from '~/components/common/ClientOnly'
import { PageDataHolder } from '~/components/common/PageHolder'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { XLogInfoForNote, XLogSummaryForNote } from '~/components/widgets/xlog'
import { useCurrentNoteData, useNoteByNidQuery } from '~/hooks/data/use-note'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import {
  CurrentNoteIdProvider,
  useSetCurrentNoteId,
} from '~/providers/note/CurrentNoteIdProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { parseDate } from '~/utils/datetime'
import { springScrollToTop } from '~/utils/scroller'

import { ReadIndicator } from '../../../components/common/ReadIndicator'
import { NoteHideIfSecret } from '../../../components/widgets/note/NoteHideIfSecret'
import { NoteMetaBar } from '../../../components/widgets/note/NoteMetaBar'
import styles from './page.module.css'

const NoteActionAside = dynamic(
  () =>
    import('~/components/widgets/note/NoteActionAside').then(
      (mod) => mod.NoteActionAside,
    ),
  { ssr: false },
)

const NoteFooterNavigationBarForMobile = dynamic(
  () =>
    import('~/components/widgets/note/NoteFooterNavigation').then(
      (mod) => mod.NoteFooterNavigationBarForMobile,
    ),
  { ssr: false },
)

const NoteTopic = dynamic(
  () =>
    import('~/components/widgets/note/NoteTopic').then((mod) => mod.NoteTopic),
  { ssr: false },
)

const SubscribeBell = dynamic(
  () =>
    import('~/components/widgets/subscribe/SubscribeBell').then(
      (mod) => mod.SubscribeBell,
    ),
  { ssr: false },
)
const TocAside = dynamic(
  () => import('~/components/widgets/toc').then((mod) => mod.TocAside),
  { ssr: false },
)
const TocAutoScroll = dynamic(
  () => import('~/components/widgets/toc').then((mod) => mod.TocAutoScroll),
  { ssr: false },
)

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

  return (
    <CurrentNoteIdProvider initialNoteId={id}>
      <NotePage note={note} />
    </CurrentNoteIdProvider>
  )
}

const NotePage = memo(({ note }: { note: NoteModel }) => {
  const tips = `创建于 ${parseDate(note.created, 'YYYY 年 M 月 D 日 dddd')}${
    note.modified
      ? `，修改于 ${parseDate(note.modified, 'YYYY 年 M 月 D 日 dddd')}`
      : ''
  }`

  return (
    <Suspense>
      <article
        className={clsx(
          'prose relative',
          styles['with-indent'],
          styles['with-serif'],
        )}
      >
        <header>
          <NoteTitle />
          <span className="flex flex-wrap items-center text-[13px] text-neutral-content/60">
            <FloatPopover as="span" TriggerComponent={NoteDateMeta}>
              {tips}
            </FloatPopover>

            <ClientOnly>
              <NoteMetaBar />
            </ClientOnly>
          </span>
        </header>

        <NoteHideIfSecret>
          <XLogSummaryForNote />
          <WrappedElementProvider>
            <MarkdownImageRecordProvider
              images={note.images || (noopArr as Image[])}
            >
              <BanCopyWrapper>
                <Markdown
                  as="main"
                  renderers={MarkdownRenderers}
                  value={note.text}
                />
              </BanCopyWrapper>
            </MarkdownImageRecordProvider>

            <LayoutRightSidePortal>
              <TocAside
                className="sticky top-[120px] ml-4 mt-[120px]"
                treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
                accessory={ReadIndicator}
              >
                <NoteActionAside className="translate-y-full" />
              </TocAside>
              <TocAutoScroll />
            </LayoutRightSidePortal>
          </WrappedElementProvider>
        </NoteHideIfSecret>
      </article>

      <SubscribeBell defaultType="note_c" />
      <NoteTopic topic={note.topic} />
      <XLogInfoForNote />
      <NoteFooterNavigationBarForMobile noteId={note.nid.toString()} />
    </Suspense>
  )
})

const NoteTitle = () => {
  const note = useCurrentNoteData()
  if (!note) return null
  const title = note.title
  return (
    <h1 className="mt-8 text-left font-bold text-base-content/95">
      <Balancer>{title}</Balancer>
    </h1>
  )
}

const NoteDateMeta = () => {
  const note = useCurrentNoteData()
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
