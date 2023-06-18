'use client'

import { useEffect } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'
import type { ReactNode } from 'react'

import { ClientOnly } from '~/components/common/ClientOnly'
import { PageDataHolder } from '~/components/common/PageHolder'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/internal/hooks'
import { DividerVertical } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { Toc, TocAutoScroll } from '~/components/widgets/toc'
import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { useNoteByNidQuery, useNoteData } from '~/hooks/data/use-note'
import { mood2icon, weather2icon } from '~/lib/meta-icon'
import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { MarkdownImageRecordProvider } from '~/providers/article/markdown-image-record-provider'
import { useSetCurrentNoteId } from '~/providers/note/current-note-id-provider'
import { NoteLayoutRightSidePortal } from '~/providers/note/right-side-provider'
import { parseDate } from '~/utils/datetime'
import { springScrollToTop } from '~/utils/scroller'

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
  useBeforeMounted(() => {
    setNoteId(id)
  })

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

      <ArticleElementProvider>
        <MarkdownImageRecordProvider images={note.images || noopArr}>
          <Markdown as="main" renderers={Markdownrenderers} value={note.text} />
        </MarkdownImageRecordProvider>

        <NoteLayoutRightSidePortal>
          <Toc className="sticky top-[120px] ml-4 mt-[120px]" />
          <TocAutoScroll />
        </NoteLayoutRightSidePortal>
      </ArticleElementProvider>
    </article>
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

const NoteMetaBar = () => {
  const note = useNoteData()
  if (!note) return null

  const children = [] as ReactNode[]
  if (note.weather || !note.mood) {
    children.push(<DividerVertical className="!mx-2 scale-y-50" />)
  }

  if (note.weather) {
    children.push(
      <span className="inline-flex items-center space-x-1">
        {weather2icon(note.weather)}
        <span className="font-medium">{note.weather}</span>
        <DividerVertical className="!mx-2 scale-y-50" />
      </span>,
    )
  }

  if (note.mood) {
    children.push(
      <span className="inline-flex items-center space-x-1">
        {mood2icon(note.mood)}
        <span className="font-medium">{note.mood}</span>
      </span>,
    )
  }

  if (note.count.read > 0) {
    children.push(
      <DividerVertical className="!mx-2 scale-y-50" />,
      <span className="inline-flex items-center space-x-1">
        <i className="icon-[mingcute--book-6-line]" />
        <span className="font-medium">{note.count.read}</span>
      </span>,
    )
  }

  return children
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

const Markdownrenderers: { [name: string]: Partial<MarkdownToJSX.Rule> } = {
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
