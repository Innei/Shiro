/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { useEffect, useMemo } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'
import type { ReactNode } from 'react'

import { useIsLogged } from '~/atoms/owner'
import { ClientOnly } from '~/components/common/ClientOnly'
import { PageDataHolder } from '~/components/common/PageHolder'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/internal/hooks'
import { DividerVertical } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { NoteTopic } from '~/components/widgets/note/NoteTopic'
import { TocAside, TocAutoScroll } from '~/components/widgets/toc'
import { XLogInfoForNote, XLogSummaryForNote } from '~/components/widgets/xlog'
import { useNoteByNidQuery, useNoteData } from '~/hooks/data/use-note'
import { mood2icon, weather2icon } from '~/lib/meta-icon'
import { toast } from '~/lib/toast'
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
      {!!note.topic && <NoteTopic topic={note.topic} />}
      <XLogInfoForNote />
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

const NoteMetaBar = () => {
  const note = useNoteData()
  if (!note) return null

  const children = [] as ReactNode[]
  if (note.weather || note.mood) {
    children.push(<DividerVertical className="!mx-2 scale-y-50" key="d0" />)
  }

  if (note.weather) {
    children.push(
      <span className="inline-flex items-center space-x-1" key="weather">
        {weather2icon(note.weather)}
        <span className="font-medium">{note.weather}</span>
        <DividerVertical className="!mx-2 scale-y-50" />
      </span>,
    )
  }

  if (note.mood) {
    children.push(
      <span className="inline-flex items-center space-x-1" key="mood">
        {mood2icon(note.mood)}
        <span className="font-medium">{note.mood}</span>
      </span>,
    )
  }

  if (note.count.read > 0) {
    children.push(
      <DividerVertical className="!mx-2 scale-y-50" key="d1" />,
      <span className="inline-flex items-center space-x-1" key="readcount">
        <i className="icon-[mingcute--book-6-line]" />
        <span className="font-medium">{note.count.read}</span>
      </span>,
    )
  }

  if (note.count.like > 0) {
    children.push(
      <DividerVertical className="!mx-2 scale-y-50" key="d2" />,
      <span className="inline-flex items-center space-x-1" key="linkcount">
        <i className="icon-[mingcute--heart-line]" />
        <span className="font-medium">{note.count.like}</span>
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

const NoteHideIfSecret: Component = ({ children }) => {
  const note = useNoteData()
  const secretDate = useMemo(() => new Date(note?.secret!), [note?.secret])
  const isSecret = note?.secret
    ? dayjs(note?.secret).isAfter(new Date())
    : false

  const isLogged = useIsLogged()

  useEffect(() => {
    if (!note?.id) return
    let timer: any
    const timeout = +secretDate - +new Date()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        toast('刷新以查看解锁的文章', 'info', { autoClose: false })
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate, note?.id])

  if (!note) return null

  if (isSecret) {
    const dateFormat = note.secret
      ? Intl.DateTimeFormat('zh-cn', {
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
          day: 'numeric',
          month: 'long',
        }).format(new Date(note.secret))
      : ''

    if (isLogged) {
      return (
        <>
          <div className="my-6 text-center">
            <p>这是一篇非公开的文章。(将在 {dateFormat} 解锁)</p>
            <p>现在处于登录状态，预览模式：</p>
          </div>
          {children}
        </>
      )
    }
    return (
      <div className="my-6 text-center">
        这篇文章暂时没有公开呢，将会在 {dateFormat} 解锁，再等等哦
      </div>
    )
  }
  return children
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
