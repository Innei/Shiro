/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { memo, useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'
import type { PropsWithChildren } from 'react'

import { BanCopyWrapper } from '~/components/common/BanCopyWrapper'
import { ClientOnly } from '~/components/common/ClientOnly'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { FloatPopover } from '~/components/ui/float-popover'
import { Markdown } from '~/components/ui/markdown'
import { NoteBanner } from '~/components/widgets/note/NoteBanner'
import { XLogInfoForNote, XLogSummaryForNote } from '~/components/widgets/xlog'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'
import { useCurrentNoteId } from '~/providers/note/CurrentNoteIdProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { parseDate } from '~/utils/datetime'

import { ReadIndicator } from '../../../components/common/ReadIndicator'
import { NoteHideIfSecret } from '../../../components/widgets/note/NoteHideIfSecret'
import { NoteMetaBar } from '../../../components/widgets/note/NoteMetaBar'
import styles from './page.module.css'

const NoteActionAside = dynamic(() =>
  import('~/components/widgets/note/NoteActionAside').then(
    (mod) => mod.NoteActionAside,
  ),
)

const NoteFooterNavigationBarForMobile = dynamic(() =>
  import('~/components/widgets/note/NoteFooterNavigation').then(
    (mod) => mod.NoteFooterNavigationBarForMobile,
  ),
)

const NoteTopic = dynamic(() =>
  import('~/components/widgets/note/NoteTopic').then((mod) => mod.NoteTopic),
)

const SubscribeBell = dynamic(() =>
  import('~/components/widgets/subscribe/SubscribeBell').then(
    (mod) => mod.SubscribeBell,
  ),
)
const TocAside = dynamic(() =>
  import('~/components/widgets/toc').then((mod) => mod.TocAside),
)

const PageImpl = () => {
  return (
    <>
      <NotePage />
      <NoteHeaderMetaInfoSetting />
    </>
  )
}

const NotePage = memo(function Notepage() {
  const noteId = useCurrentNoteId()
  if (!noteId) return null

  return (
    <>
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
            <NoteHeaderDate />

            <ClientOnly>
              <NoteMetaBar />
            </ClientOnly>
          </span>
          <div className="ml-[-1.25em] mr-[-1.25em] mt-8 text-sm lg:ml-[calc(-3em)] lg:mr-[calc(-3em)]">
            <NoteBanner />
          </div>
        </header>

        <NoteHideIfSecret>
          <XLogSummaryForNote />
          <WrappedElementProvider>
            <NoteMarkdownImageRecordProvider>
              <BanCopyWrapper>
                <NoteMarkdown />
              </BanCopyWrapper>
            </NoteMarkdownImageRecordProvider>

            <LayoutRightSidePortal>
              <TocAside
                className="sticky top-[120px] ml-4 mt-[120px]"
                treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
                accessory={ReadIndicator}
              >
                <NoteActionAside className="translate-y-full" />
              </TocAside>
            </LayoutRightSidePortal>
          </WrappedElementProvider>
        </NoteHideIfSecret>
      </article>

      <SubscribeBell defaultType="note_c" />
      <NoteTopic />
      <XLogInfoForNote />
      <NoteFooterNavigationBarForMobile noteId={noteId} />
    </>
  )
})

const NoteTitle = () => {
  const title = useCurrentNoteDataSelector((data) => data?.data.title)
  if (!title) return null
  return (
    <h1 className="mt-8 text-left font-bold text-base-content/95">
      <Balancer>{title}</Balancer>
    </h1>
  )
}

const NoteDateMeta = () => {
  const created = useCurrentNoteDataSelector((data) => data?.data.created)
  if (!created) return null
  const dateFormat = dayjs(created)
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

const NoteHeaderDate = () => {
  const date = useCurrentNoteDataSelector((data) => ({
    created: data?.data.created,
    modified: data?.data.modified,
  }))
  if (!date?.created) return null

  const tips = `创建于 ${parseDate(date.created, 'YYYY 年 M 月 D 日 dddd')}${
    date.modified
      ? `，修改于 ${parseDate(date.modified, 'YYYY 年 M 月 D 日 dddd')}`
      : ''
  }`

  return (
    <FloatPopover as="span" TriggerComponent={NoteDateMeta}>
      {tips}
    </FloatPopover>
  )
}

const NoteMarkdown = () => {
  const text = useCurrentNoteDataSelector((data) => data?.data.text)!

  return <Markdown as="main" renderers={MarkdownRenderers} value={text} />
}
const NoteMarkdownImageRecordProvider = (props: PropsWithChildren) => {
  const images = useCurrentNoteDataSelector(
    (data) => data?.data.images || (noopArr as Image[]),
  )!

  return (
    <MarkdownImageRecordProvider images={images}>
      {props.children}
    </MarkdownImageRecordProvider>
  )
}

const NoteHeaderMetaInfoSetting = () => {
  const setHeaderMetaInfo = useSetHeaderMetaInfo()
  const meta = useCurrentNoteDataSelector((data) => {
    if (!data) return null
    const note = data.data

    return {
      title: note?.title,
      description: `手记${note.topic?.name ? ` / ${note.topic?.name}` : ''}`,
      slug: note?.nid.toString(),
    }
  })

  useEffect(() => {
    if (meta) setHeaderMetaInfo(meta)
  }, [meta])

  return null
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

export default PageImpl
