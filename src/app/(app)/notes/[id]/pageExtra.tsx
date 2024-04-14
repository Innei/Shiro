/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import type { Image } from '@mx-space/api-client'
import type { MarkdownToJSX } from '~/components/ui/markdown'
import type { FC, PropsWithChildren } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { withClientOnly } from '~/components/common/ClientOnly'
import { MdiClockOutline } from '~/components/icons/clock'
import { useSetHeaderMetaInfo } from '~/components/layout/header/hooks'
import { GoToAdminEditingButton } from '~/components/modules/shared/GoToAdminEditingButton'
import { WithArticleSelectionAction } from '~/components/modules/shared/WithArticleSelectionAction'
import { FloatPopover } from '~/components/ui/float-popover'
import { MainMarkdown } from '~/components/ui/markdown'
import { parseDate } from '~/lib/datetime'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useCurrentNoteDataSelector,
  useSetCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import { queries } from '~/queries/definition'

import styles from './page.module.css'

export const MarkdownSelection: Component = (props) => {
  const id = useCurrentNoteDataSelector((data) => data?.data?.id)!
  const title = useCurrentNoteDataSelector((data) => data?.data?.title)!
  const canComment = useCurrentNoteDataSelector(
    (data) => data?.data.allowComment,
  )!
  return (
    <WithArticleSelectionAction
      refId={id}
      title={title}
      canComment={canComment}
    >
      {props.children}
    </WithArticleSelectionAction>
  )
}

export const NoteTitle = () => {
  const title = useCurrentNoteDataSelector((data) => data?.data.title)
  const id = useCurrentNoteDataSelector((data) => data?.data.id)

  if (!title) return null
  return (
    <>
      <h1 className="mt-8 text-left font-bold text-base-content/95">{title}</h1>

      <GoToAdminEditingButton
        type="notes"
        id={id!}
        className="absolute right-0 top-0"
      />
    </>
  )
}

export const NoteDateMeta = () => {
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
export const NoteHeaderDate = () => {
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
    <FloatPopover as="span" type="tooltip" TriggerComponent={NoteDateMeta}>
      {tips}
    </FloatPopover>
  )
}
export const NoteMarkdown = () => {
  const text = useCurrentNoteDataSelector((data) => data?.data.text)!

  return (
    <MainMarkdown
      className="mt-10"
      allowsScript
      renderers={MarkdownRenderers}
      value={text}
    />
  )
}
export const NoteMarkdownImageRecordProvider = (props: PropsWithChildren) => {
  const images = useCurrentNoteDataSelector(
    (data) => data?.data.images || (noopArr as Image[]),
  )!

  return (
    <MarkdownImageRecordProvider images={images}>
      {props.children}
    </MarkdownImageRecordProvider>
  )
}
export const NoteHeaderMetaInfoSetting = () => {
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
      return <span key={state?.key}>{node.content}</span>
    },
  },
}
export const IndentArticleContainer = (props: PropsWithChildren) => {
  return (
    <article
      className={clsx(
        'prose relative',
        styles['with-indent'],
        styles['with-serif'],
      )}
    >
      {props.children}
    </article>
  )
}

export const NoteDataReValidate: FC<{ fetchedAt: string }> = withClientOnly(
  ({ fetchedAt }) => {
    const isOutdated = useMemo(
      () =>
        Date.now() - new Date(fetchedAt).getTime() > appStaticConfig.revalidate,
      [fetchedAt],
    )

    const dataSetter = useSetCurrentNoteData()

    const nid = useCurrentNoteDataSelector((note) => {
      if (!note) return {}
      return note.data.nid
    })
    const onceRef = useRef(false)
    const queryClient = useQueryClient()
    useEffect(() => {
      if (onceRef.current) return
      onceRef.current = true
      if (!isOutdated) return

      if (!nid) return

      queryClient
        .fetchQuery(queries.note.byNid(nid.toString()))
        .then((data) => {
          dataSetter(data)
          // toast.info('此文章访问的内容已过期，所以页面数据自动更新了。')
          // eslint-disable-next-line no-console
          console.log('Note data revalidated', data)
        })
    }, [dataSetter, isOutdated, nid, queryClient])
    return null
  },
)
