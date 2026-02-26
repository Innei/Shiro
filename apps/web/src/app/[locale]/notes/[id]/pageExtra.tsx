'use client'

import type {
  Image,
  NoteWrappedWithLikedAndTranslationPayload,
} from '@mx-space/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { useFormatter, useLocale, useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import { useEffect, useMemo, useRef } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { withClientOnly } from '~/components/common/ClientOnly'
import { MdiClockOutline } from '~/components/icons/clock'
import { GoToAdminEditingButton } from '~/components/modules/shared/GoToAdminEditingButton'
import { WithArticleSelectionAction } from '~/components/modules/shared/WithArticleSelectionAction'
import { FloatPopover } from '~/components/ui/float-popover'
import { logger } from '~/lib/logger'
import { noopArr } from '~/lib/noop'
import { MarkdownImageRecordProvider } from '~/providers/article/MarkdownImageRecordProvider'
import {
  useCurrentNoteDataSelector,
  useSetCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import { queries } from '~/queries/definition'

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
    <div className="relative">
      <h1 className="my-8 text-balance text-left text-4xl font-bold leading-tight text-base-content/95">
        {title}
      </h1>

      <GoToAdminEditingButton
        type="notes"
        id={id!}
        className="absolute right-0 top-0"
      />
    </div>
  )
}

export const NoteDateMeta = () => {
  const created = useCurrentNoteDataSelector((data) => data?.data.created)
  const format = useFormatter()

  if (!created) return null
  const dateFormat = format.dateTime(new Date(created), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <span className="inline-flex items-center space-x-1">
      <MdiClockOutline />
      <span className="font-medium">{dateFormat}</span>
    </span>
  )
}
export const NoteHeaderDate = withClientOnly(() => {
  const date = useCurrentNoteDataSelector((data) => ({
    created: data?.data.created,
    modified: data?.data.modified,
  }))
  const format = useFormatter()
  const t = useTranslations('common')

  if (!date?.created) return null

  const tips = date.modified
    ? t('modified_at', {
        date: format.dateTime(new Date(date.modified), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }),
      })
    : ''

  return (
    <FloatPopover
      sheet={{
        triggerAsChild: false,
      }}
      as="span"
      mobileAsSheet
      type="tooltip"
      TriggerComponent={NoteDateMeta}
    >
      {tips}
    </FloatPopover>
  )
})

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
export const IndentArticleContainer = ({
  children,
  prose = true,
}: PropsWithChildren<{
  prose?: boolean
}>) => (
  <article className={clsx('relative', prose && 'prose')}>{children}</article>
)

export const NoteDataReValidate: FC<{ fetchedAt: string }> = withClientOnly(
  ({ fetchedAt }) => {
    const isOutdated = useMemo(
      () =>
        Date.now() - new Date(fetchedAt).getTime() > appStaticConfig.revalidate,
      [fetchedAt],
    )

    const dataSetter = useSetCurrentNoteData()
    const locale = useLocale()

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
        .fetchQuery(queries.note.byNid(nid.toString(), null, locale))
        .then((data) => {
          dataSetter(data as NoteWrappedWithLikedAndTranslationPayload)
          // toast.info('此文章访问的内容已过期，所以页面数据自动更新了。')
          logger.log('Note data revalidated', data)
        })
    }, [dataSetter, isOutdated, locale, nid, queryClient])
    return null
  },
)
